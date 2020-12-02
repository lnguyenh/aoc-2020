const neatCsv = require('neat-csv');
const csv = require('csv-parser')
const fs = require('fs')
const util = require('util');

const readFile = util.promisify(fs.readFile);

const neatParse = async (fileName) => {
    const fileData = await readFile(fileName)
    const results = await neatCsv(fileData, { separator: ':' , headers: ['rule', 'password']})
    return results
}

const parseRule = (ruleString) => {
    const format = /(\d+)\-(\d+) (.)/
    return format.exec(ruleString)
}

const isValid = (minOccur, maxOccur, letter, testString) => {
    const numOccur = testString.split(letter).length - 1
    return (minOccur <= numOccur && numOccur <= maxOccur)
}

neatParse('data.csv').then((data) => {
        let numValid = 0
        data.forEach((row) => {
            // Get Rule
            let minOccur, maxOccur, letter, first, rest
            [first, minOccur, maxOccur, letter, ...rest] = parseRule(row['rule'])

            // Check if rule is followed
            if (isValid(minOccur, maxOccur, letter, row['password'])) {
                numValid += 1
            } else {
                console.log(row)
            }
        })
        console.log(`Num valid ${numValid}`)
    }
)
