import { listQuestionsByTopic, listTopics } from '../services/topicService.js'

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export const getTopics = async (req, res, next) => {
  try {
    const topics = await listTopics()

    res.status(200).json({
      topics: topics.map((topic) => ({
        id: topic.id,
        name: topic.title,
        level: topic.tier,
      })),
    })
  } catch (err) {
    next(err)
  }
}

export const getQuestionsByTopic = async (req, res, next) => {
  try {
    const { topicId } = req.params

    if (!UUID_RE.test(topicId)) {
      return res.status(400).json({ error: 'Invalid topic id' })
    }

    const topics = await listTopics()
    const topic = topics.find(
      (row) => row.id?.toLowerCase() === topicId.toLowerCase(),
    )

    if (!topic) {
      return res.status(404).json({ error: 'Topic not found' })
    }

    const problems = await listQuestionsByTopic(topic.id)

    res.status(200).json({
      questions: problems.map((problem) => ({
        id: problem.id,
        name: problem.prompt,
        title: problem.prompt,
        difficulty: topic.tier,
        topicId: problem.topic_id,
      })),
    })
  } catch (err) {
    next(err)
  }
}
