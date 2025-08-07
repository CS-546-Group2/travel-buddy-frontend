// js/appConfig.js

const appConfig = {
  USE_PRODUCTION_API: true, // set to true for deployed backend
  LOCAL_API_BASE: 'http://localhost:3001/api',
  PROD_API_BASE: 'https://travel-buddy-backend-1obh.onrender.com/api',

  get API_BASE() {
    return this.USE_PRODUCTION_API ? this.PROD_API_BASE : this.LOCAL_API_BASE;
  }
};

export default appConfig;
