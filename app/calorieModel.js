const lbsPerKg = 2.2;
const cmPerInch = 2.54;

const lbsToKg = (weightInLbs) => weightInLbs / lbsPerKg;
const InchestToCm = (lengthInInches) => lengthInInches * cmPerInch;
const sexToCalConstant = (sex) => sex === 'Female' ? -161 : 5;

module.exports = function calorieModel([weightInLbs, heightInInches, ageYears, sex]) {
    const weightInKg = lbsToKg(weightInLbs);
    const heightInCm = InchestToCm(heightInInches);
    const sexCalConstant = sexToCalConstant(sex);

    //Mifflin - St Jeor Formula for calorie needs
    //See: https://www.freedieting.com/calorie_needs.html
    const calorieNeeds = Math.round((10 * weightInKg) + (6.25 * heightInCm) - (5 * ageYears) + sexCalConstant);

    return {
        weightInLbs,
        heightInInches,
        ageYears,
        sex,
        calorieNeeds
    };
}