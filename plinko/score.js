const outputs = []


function onScoreUpdate(dropPosition, bounciness, size, bucketLabel) {
  outputs.push([ ...arguments ])
}

function distance(pointA, pointB) {

  return _.chain(pointA)
    .zip(pointB)
    .map(([ a, b ]) => (a - b) ** 2)
    .sum()
    .value() ** 0.5
}

function runAnalysis() {
  const TEST_SET_SIZE = 100
  const [ testSet, trainingSet ] = splitDataset(outputs, TEST_SET_SIZE)


  _.range(1, 20).forEach(k => {
    const accuracy = _.chain(testSet)
      .filter(testPoint => knn(trainingSet, testPoint[ 0 ], k) === testPoint[ 3 ])
      .size()
      .divide(TEST_SET_SIZE)
      .value()
    console.log(`For k of ${k} Accuracy: `, accuracy * 100, '%')

  })


}

function knn(data, point, k) {
  return _.chain(data)
    .map(([ position, , , bucket ]) => ([ distance(position, point), bucket ]))
    .sortBy(([ distance ]) => distance)
    .slice(0, k)
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