const outputs = []
const TEST_SET_SIZE = 100


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
  const k = 10


  _.range(0, 3).forEach(feature => {
    // here we want map outputs to only 1 characteristic(column) joined with result bucket number
    const data = _.map(outputs, row => [ row[ feature ], _.last(row) ])
    const [ testSet, trainingSet ] = splitDataset(minMax(data, 1), TEST_SET_SIZE)

    const accuracy = _.chain(testSet)
      .filter(testPoint => knn(trainingSet, _.initial(testPoint), k) === _.last(testPoint))
      .size()
      .divide(TEST_SET_SIZE)
      .value()
    console.log(`For feature of ${feature} Accuracy: `, accuracy * 100, '%')

  })


}

function findOptimalK(testSet, trainingSet) {
  _.range(1, 20).forEach(k => {
    const accuracy = _.chain(testSet)
      .filter(testPoint => knn(trainingSet, _.initial(testPoint), k) === testPoint[ 3 ])
      .size()
      .divide(TEST_SET_SIZE)
      .value()
    console.log(`For k of ${k} Accuracy: `, accuracy * 100, '%')

  })
}

/**
 *
 * @param data
 * @param point
 * @param k
 * @returns {*}
 */
function knn(data, point, k) {
  return _.chain(data)
    .map(row => {
      return [
        // multidimensional distance between all characteristics (using initial for remove bucket from characteristics set )
        distance(_.initial(row), point),
        // last element - is always bucket
        _.last(row)
      ]
    })
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


/**
 *
 * @param data
 * @param columnsCountToNormalize - columns count  that needs normalization ( for ex, we dont want to normalize bucket )
 *
 */
function minMax(data, columnsCountToNormalize) {
  const clonedData = _.cloneDeep(data)
  for ( let i = 0; i < columnsCountToNormalize; i++ ) {
    const column = clonedData.map(row => row[ i ])
    const min = _.min(column)
    const max = _.max(column)
    for ( let j = 0; j < clonedData.length; j++ ) {
      clonedData[ j ][ i ] = (clonedData[ j ][ i ] - min) / (max - min)
    }
  }
  return clonedData
}