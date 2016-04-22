// external imports
import sequelize from 'sequelize'
// local imports
import {Vote} from './models'
import option_source from '../options.json'


// the index view
export const index = (req, res) => {
    // a map from numbers to the word version
    const numberStrings = ['one', 'two', 'three', 'four']
    // the options to choose from
    const options = option_source['options']
    
    // add the corresponding number to each option
    for (const option of options) {
        // the index of the loop
        const index = options.indexOf(option)
        // the direction to orient
        option['orientation'] = index % 2 ? 'right' : 'left'
        // set the number attribute according to the list above
        option['number'] = numberStrings[index]
    }

    // render the index template
    res.render('index.jade', {options})
}


// the result summary
export const results = async (req, res) => {
    // connect to the database
    await Vote.sync()
    const vote_count_records = await Vote.findAll({
        attributes: {
            include: [[sequelize.fn('COUNT', sequelize.col('option')), 'count']]
        },
        group: 'option'
    })
    // a simpler datastructure to work w ith
    const count_entries = vote_count_records.map(entry => entry.dataValues)

    // retrieve the count for the given option
    const get_count = (option) => {
        // the appropriate entry
        const entry = count_entries.filter(record => record.option == option)[0]
        // return the count if the entry is present
        return entry ? entry.count : 0
    }

    // // add the count to the options
    const data = option_source['options'].map(entry => ({
        ...entry,
        count: get_count(entry.name)
    }))

    // create a list of counts from the result
    const counts = data.map(({count}) => count)

    // compute the necessary bits of data to produce the visualization
    const total = counts.reduce((prev, current) => prev + current, 0)
    const max = counts.reduce((prev, current) => current > prev ? current : prev, 0)

    // render the template with the aggregated data
    return res.render('results.jade', {data, total, max})
}


// adds a vote for the appropriate category
export const addVote = async (req, res) => {
    // the category to add a vote for
    const {option} = req.query

    try {
        // connect to the database
        await Vote.sync()
        // create a new vote corresponding to the category
        await Vote.create({option})
        // redirect to the results page
        return res.redirect('/results')

    // if something goes wrong
    } catch (err) {
        console.log("ERROR: " + err)
        // tell the user we had a problem
        return res.status(500).send(err)
    }
}