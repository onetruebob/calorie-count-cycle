import xs from 'xstream';
import xsHelpers from './xsHelpers';
import {run} from '@cycle/run';
import {div, span, input, select, option, h1, h2, p, label, makeDOMDriver} from '@cycle/dom';
import calorieModel from './calorieModel'

function main(sources) {
    const sexOptions = ['Female', 'Male'];

    //-- Intent
    const changeWeightInLbs$ = sources.DOM.select('#weight-in-lbs')
        .events('input')
        .map(ev => parseFloat(ev.target.value) || 0);

    const changeHeightInInches$ = sources.DOM.select('#height-in-inches')
        .events('input')
        .map(ev => parseFloat(ev.target.value) || 0);

    const changeAgeYears$ = sources.DOM.select('#age-in-years')
        .events('input')
        .map(ev => parseFloat(ev.target.value) || 0);

    const changeSex$ = sources.DOM.select('#sex')
        .events('change')
        .map(ev => ev.target.value)


    const weightInLbs$ = changeWeightInLbs$.startWith(150.0);
    const heightInInches$ = changeHeightInInches$.startWith(66);
    const ageYears$ = changeAgeYears$.startWith(30);
    const sex$ = changeSex$.startWith('Female');


    //-- Model
    const state$ = xsHelpers.combineStreams(weightInLbs$, heightInInches$, ageYears$, sex$)
        .map((combindedValues) => calorieModel(combindedValues))

    //-- View
    const vdom$ = state$.map((model) =>
        div([
            div('.calc-section.calc-title', [
                h1('Basil Metabolic Rate Calories')
            ]),
            div('.calc-section.calc-inputs', [
                div('.calc-input', [
                    label({ attrs: { for: 'weight-in-lbs' } }, 'How much do you weight?'),
                    input('#weight-in-lbs', { attrs: { type: 'number', value: model.weightInLbs, size: 4 } }),
                    span('.calc-input-units', 'pounds')
                ]),
                div('.calc-input', [
                    label({ attrs: { for: 'height-in-inches' } }, 'How tall are you?'),
                    input('#height-in-inches', { attrs: { type: 'number', value: model.heightInInches, size: 4 } }),
                    span('.calc-input-units', 'inches')
                ]),
                div('.calc-input', [
                    label({ attrs: { for: 'age-in-years' } }, 'How old are you?'),
                    input('#age-in-years', { attrs: { type: 'number', value: model.ageYears, size: 4 } }),
                    span('.calc-input-units', 'years')
                ]),
                div('.calc-input', [
                    label({ attrs: { for: 'sex' } }, 'What is your biological sex?'),
                    select('#sex', { attrs: { required: 'required' } }, sexOptions.map((sex) => {
                        return option({ attrs: { value: sex, selected: model.sex === sex? 'selected' : '' } }, sex);
                    }))
                ])
            ]),
            div('.calc-section.calc-results', [
                p('You basil metabolic rate daily calorie intake is:'),
                h2('.calc-result', `${model.calorieNeeds} calories`)
            ])
        ])
    );

    return {
        DOM: vdom$
    }
}

run(main, { DOM: makeDOMDriver('#calorie-calculator') });