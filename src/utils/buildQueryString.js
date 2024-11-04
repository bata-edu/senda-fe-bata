export const buildQueryString = (params) => {
    return Object.keys(params)
      .filter((key) => params[key] !== undefined && params[key] !== null) 
      .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
      .join('&');
};

