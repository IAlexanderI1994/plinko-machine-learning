const outputs = []

const PREDICTION_POINT = 300
const K = 3

function onScoreUpdate(dropPosition, bounciness, size, bucketLabel) {
  outputs.push([ ...arguments ])
}

function distance(value) {
  return Math.abs(value - PREDICTION_POINT)
}

function runAnalysis() {
  const bucket = _.chain(outputs)
    .map(([ position, , , bucket ]) => ([ distance(position), bucket ]))
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

  console.log('probably fall to ', bucket)

}

