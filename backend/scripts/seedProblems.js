// Dry-run by default. Inserts only when --write is passed.
// Usage from backend/:
//   node scripts/seedProblems.js --limit 1 --per-topic 1
//   node scripts/seedProblems.js --limit 1 --per-topic 1 --write

import supabase from '../src/config/supabase.js'
import {
  MAX_PROBLEMS_PER_TOPIC,
  generateProblemForTopic,
  insertProblem,
  listTopicsForGeneration,
} from '../src/services/problemGenerationService.js'

const RATE_LIMIT_BACKOFF_MS = [5000, 10000, 20000]

const args = readArgs(process.argv)

const topics = await listTopicsForGeneration(args.limit)

if (topics.length === 0) {
  console.error('No topics found in public.topics')
  process.exit(1)
}

console.log(
  `${args.write ? 'write' : 'dry-run'}: ${topics.length} topic(s), ${args.perTopic} problem(s) each`,
)

let failed = false

for (const topic of topics) {
  let existing
  try {
    existing = await existingProblemsForTopic(topic.id)
  } catch (err) {
    failed = true
    console.error(`Generation failed for topic "${topic.title}": ${err.message}`)
    if (!args.continueOnError) {
      process.exit(1)
    }
    continue
  }

  if (existing.length >= MAX_PROBLEMS_PER_TOPIC) {
    const label = existing.length === 1 ? 'problem' : 'problems'
    console.log(`SKIP: ${topic.title} already has ${existing.length} ${label}`)
    continue
  }

  const knownPrompts = new Set(
    existing
      .map((row) => row.prompt)
      .filter((prompt) => typeof prompt === 'string'),
  )

  for (let index = 0; index < args.perTopic; index += 1) {
    const filled = existing.length + index
    if (filled >= MAX_PROBLEMS_PER_TOPIC) {
      const label = filled === 1 ? 'problem' : 'problems'
      console.log(`SKIP: ${topic.title} already has ${filled} ${label}`)
      break
    }

    try {
      console.log(`GENERATE: ${topic.title}`)
      const problem = await generateWithRateLimitRetry(topic)

      console.log(JSON.stringify({
        topicId: topic.id,
        topicTitle: topic.title,
        tier: topic.tier,
        problem,
      }, null, 2))

      if (knownPrompts.has(problem.prompt)) {
        console.log(`SKIP: duplicate prompt for topic ${topic.title}`)
        continue
      }

      if (!args.write) {
        knownPrompts.add(problem.prompt)
        console.log(`dry-run: not inserted (${topic.title})`)
        continue
      }

      const inserted = await insertProblem(topic.id, problem)
      knownPrompts.add(problem.prompt)
      console.log(`inserted ${inserted.id} for topic ${topic.title}`)
    } catch (err) {
      if (isRateLimitError(err)) {
        console.log(`RATE LIMIT: skipped ${topic.title} after 3 retries`)
        continue
      }

      failed = true
      console.error(`Generation failed for topic "${topic.title}": ${err.message}`)

      if (!args.continueOnError) {
        process.exit(1)
      }
    }
  }
}

if (failed) {
  process.exit(1)
}

async function generateWithRateLimitRetry(topic) {
  const maxRetries = RATE_LIMIT_BACKOFF_MS.length

  for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
    try {
      return await generateProblemForTopic(topic)
    } catch (err) {
      if (!isRateLimitError(err) || attempt === maxRetries) {
        throw err
      }

      const delay = RATE_LIMIT_BACKOFF_MS[attempt]
      console.log(`RATE LIMIT: retrying ${topic.title} in ${delay / 1000}s`)
      await delayMs(delay)
    }
  }
}

function isRateLimitError(err) {
  return err?.status === 429 || /rate limit/i.test(err?.message || '')
}

function delayMs(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

async function existingProblemsForTopic(topicId) {
  const { data, error } = await supabase
    .from('problems')
    .select('id, prompt')
    .eq('topic_id', topicId)

  if (error) throw error
  return data ?? []
}

function readArgs(argv) {
  const args = {
    limit: 1,
    perTopic: 1,
    write: false,
    continueOnError: false,
  }

  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i]

    if (arg === '--write') {
      args.write = true
    } else if (arg === '--continue') {
      args.continueOnError = true
    } else if (arg === '--limit') {
      args.limit = readPositiveInt(argv[i + 1], '--limit')
      i += 1
    } else if (arg === '--per-topic') {
      args.perTopic = readPositiveInt(argv[i + 1], '--per-topic')
      i += 1
    } else {
      console.error(`Unknown argument: ${arg}`)
      process.exit(1)
    }
  }

  if (args.perTopic > MAX_PROBLEMS_PER_TOPIC) {
    console.error(`--per-topic cannot exceed ${MAX_PROBLEMS_PER_TOPIC}`)
    process.exit(1)
  }

  return args
}

function readPositiveInt(value, flag) {
  const parsed = Number(value)

  if (!Number.isInteger(parsed) || parsed < 1) {
    console.error(`${flag} must be a positive integer`)
    process.exit(1)
  }

  return parsed
}
