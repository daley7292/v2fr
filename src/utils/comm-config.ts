const GetCommConfig = () => {
  const commConfig = localStorage.getItem('commConfig');
  if (!commConfig) {
    return null;
  }
  return JSON.parse(commConfig);
};
const GetCurrency = () => {
  const commConfig = GetCommConfig();
  if (commConfig?.currency) {
    return commConfig.currency;
  }
  return 'CNY';
};

const GetCurrencySymbol = () => {
  const commConfig = GetCommConfig();
  if (commConfig?.currency_symbol) {
    return commConfig.currency_symbol;
  }
  return '￥';
};

const GetGuestConfig = () => {
  const guestConfig = localStorage.getItem('guest_config');
  if (!guestConfig) {
    return null;
  }
  return JSON.parse(guestConfig);
};

const GetAppName = () => {
  const guestConfig = GetGuestConfig();
  if (guestConfig?.app_name) {
    document.title = guestConfig.app_name;
    return guestConfig.app_name;
  }
  return 'V2Board';
};

const GetAppDescription = () => {
  const guestConfig = GetGuestConfig();
  if (guestConfig?.app_description) {
    document.title = guestConfig.app_description;
    return guestConfig.app_description;
  }
  return 'V2Board';
};

const GetLogo = () => {
  const guestConfig = GetGuestConfig();
  if (guestConfig?.logo) {
    return guestConfig.logo;
  }
  return '';
}

export { GetCurrency, GetCurrencySymbol,GetAppName,GetAppDescription,GetLogo };
