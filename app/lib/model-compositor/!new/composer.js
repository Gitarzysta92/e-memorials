
const composer = {
  partials: {},
  utils: {},
  model: {},
  settings: {
    sections: ['header', 'main', 'footer'],
    partialsProps: ['name', 'postition', 'context']
  }
}



//
composer.createPageData = function(pageData) {
  this.validateScheme(pageData);
  const sections = this.settings.sections
  const scheme = {};

  sections.forEach(section => {
    scheme[section] = this._partialsParser(pageData[section]);
  });

  return scheme;
}

// 
composer._partialsParser = function(partialsList) {
  partialsList.sort((prev, curr) => { prev['position'] - curr['position'] });
  const preparedPartials = partialsList.reduce((acc, curr) => {
    console.log(curr);
    const isNotRegistered = !this.partials.hasOwnProperty(curr.name);
    if (isNotRegistered) return acc;

    return [...acc, (this.partials[curr.name](curr))]
  }, []);
  return preparedPartials;
}


// register new model for partial template
composer.registerModel = function(options = {}, model) {
  const requiredProps = ['name', 'type'];
  const { lostProps } = this.utils._validate(options, requiredProps);
  if (lostProps) throw new Error('Failed to register model: ', lostProps.join(' '));
  
  const { type, name } = options;
  Object.defineProperty(this[type], name, {
    value: model,
    enumerable: true
  })
}


// analyze given scheme structure
composer.validateScheme = function(dataScheme) {
  if (typeof dataScheme !== 'object') return;

  this._validateGeneralStructure(dataScheme, this.settings.sections);
  for (let key in dataScheme) {
    this._validatePartials(dataScheme[key], this.settings.partialsProps);
  }
}


// check is given scheme have valid properties
composer._validateGeneralStructure = function(model, requiredProps) {
  const notExisting = this.utils._validate(model, requiredProps);

  if (notExisting.length > 0) {
    const errorDescription = 'Scheme validate error. Missing required properties'
    const errorDetails = notExisting.join('\r\n');
    throw new Error(`${errorDescription} : ${errorDetails}`);
  }
}


// check is given scheme have valid partial properties
composer._validatePartials = function(list, requiredProps) {
  if (!Array.isArray(list)) throw new Error('Partials list must be an array');

  const notExisting = list.filter(partial => {
    const { lostProps } = this.utils._validate(partial, requiredProps);
    return lostProps ? false : lostProps;
  })

  if (notExisting.length > 0) {
    const errorDescription = 'Partials validate error. Missing required properties'
    const errorDetails = notExisting.join('\r\n');
    throw new Error(`${errorDescription} : ${errorDetails}`);
  }
}


// multi purpose properties validation
composer.utils._validate = function(model = {}, reqProps = []) {
  const notExisting = reqProps.filter(prop => !model.hasOwnProperty(prop));
  return notExisting.length === 0 ? { valid: true } : {valid: false, lostProps: notExisting}
}




module.exports = composer;


