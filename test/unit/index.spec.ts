const index = require('../../src/index');
let testSite;
beforeAll(async () => {
  testSite = await index.getSite('/abilify.html');
});

test('getUrl should return new url', () => {
  const expectedUrl = 'https://drugs.com/drug_information.html';
  let url = index.getUrl('/drug_information.html')
  expect(url).toBe(expectedUrl);
});

test('getUrl should return same url', () => {
  const expectedUrl = 'https://drug_information.html';
  let url = index.getUrl('https://drug_information.html')
  expect(url).toBe(expectedUrl);
});

test('isNotRoot should return true  since path found', () => {
  const expecteResult = true;
  let result = index.isNotRoot('/alpha/aa.html')
  expect(result).toBe(expecteResult);
});

test('isNotRoot should return true  since path found', () => {
  const expecteResult = true;
  let result = index.isNotRoot('/alpha/ab.html')
  expect(result).toBe(expecteResult);
});

test('isNotRoot should return true  since path found', () => {
  const expecteResult = true;
  let result = index.isNotRoot('/alpha/mb.html')
  expect(result).toBe(expecteResult);
});

test('isNotRoot should return false  since not path found', () => {
  const expecteResult = false;
  let result = index.isNotRoot('/a.html')
  expect(result).toBe(expecteResult);
});

test('getSite', () => {
  // tbd improve
  let expected = `
Take Abilify exactly as prescribed by your doctor. Follow all directions on your prescription label and read all medication guides or instruction sheets. Your doctor may occasionally change your dose.
Abilify can be taken with or without food.
Swallow the regular tablet whole and do not crush, chew, or break it. Do not split the orally disintegrating tablet.
Measure liquid medicine carefully. Use the dosing syringe provided, or use a medicine dose-measuring device (not a kitchen spoon).
Remove an orally disintegrating tablet from the package only when you are ready to take the medicine. Place the tablet in your mouth and allow it to dissolve, without chewing. Swallow several times as the tablet dissolves. If needed, you may drink liquid to help swallow the dissolved tablet.
Your doctor will need to check your progress on a regular basis.
If you also use antidepressant medicine, do not stop using it suddenly or you could have unpleasant symptoms. Ask your doctor before stopping the antidepressant.
Store at room temperature away from moisture and heat. Abilify liquid may be used for up to 6 months after opening, but not after the expiration date on the medicine label.

`;
  let result = index.getDosage(testSite);
  expect(result).toBe(expected);
});