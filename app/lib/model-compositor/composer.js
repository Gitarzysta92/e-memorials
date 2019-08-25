
const composer = {
  partials: {},
  utils: {},
  model: {},
  settings: {
    sections: ['menu', 'main'],
    partialsProps: ['name', 'postition', 'context']
  }
}



//
composer.createPageData = function({menu, main, models}) {
  const scheme = {}

  models && (scheme.main = this._modelsParser(models));
  main && (scheme.main = this._partialsParser(main));
  scheme.menu = this._menuParser(menu);

  return { data: scheme, templateName: 'dynamic'};
}

// 
composer._partialsParser = function(partials) {
  return partials.map(partial => {
    let { type, ...rest } = partial;

    if (type === 'button') {
      type = rest.tagType
    }

    if (type === 'predefinedElement') {
      type = rest.formType
    }


    return {
      name: type,
      context: { ...rest }
    }
  });
}

composer._modelsParser = function(models) {
  if (!Array.isArray(models)) return;
  return models.reduce((acc, curr) => Object.assign(acc, curr), {})
}


composer._menuParser = function(menuItems) {
  const navItems = menuItems.map(item => {
    return {
      path: item.path,
      title: item.title
    }
  });

  return { navItems };
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


