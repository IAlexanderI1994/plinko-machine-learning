const outputs = []

const K = 3

function onScoreUpdate(dropPosition, bounciness, size, bucketLabel) {
  outputs.push([ ...arguments ])
}

function distance(pointA, pointB) {
  return Math.abs(pointA - pointB)
}

function runAnalysis() {
  const TEST_SET_SIZE = 10
  const [ testSet, trainingSet ] = splitDataset(outputs, TEST_SET_SIZE)


  const accuracy = _.chain(testSet)
    .filter(testPoint => knn(trainingSet, testPoint[ 0 ]) === testPoint[3])
    .size()
    .divide(TEST_SET_SIZE)
    .value()
  console.log('Accuracy: ', accuracy * 100, '%')



}

function knn(data, point) {
  return _.chain(data)
    .map(([ position, , , bucket ]) => ([ distance(position, point), bucket ]))
    .sortBy(([ distance ]) => distance)
    .slice(0, K)
    .countBy(([ , bucket ]) => bucket)
    .toPairs()
    .sortBy(([ , count ]) => count)
    // take most frequently presented bucket
    .last()
    // take bucket number
    .first()
    .parseInt()
    .value()
}

function splitDataset(data, testCount) {
  const shuffled = _.shuffle(data)
  const testSet = _.slice(shuffled, 0, testCount)
  const trainingSet = _.slice(shuffled, testCount)

  return [ testSet, trainingSet ]


}