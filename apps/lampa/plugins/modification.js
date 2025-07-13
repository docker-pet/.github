(async () => {
    const initializerVersion = 'v0.0.4';
    let needToReload = false;

    // Sleep
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    // Auth
    const retryLimit = 10;
    let retryCount = 0;
    while (true) {
        if (retryCount++ >= retryLimit) {
            console.error('Retry limit reached, stopping the script.');
            break;
        }

        try {
            const url = new URL(location.href);
            const parentDomain = url.hostname.replace(/^[^.]+\./, '');

            const user = await fetch(
                `${url.protocol}//${parentDomain}/api/otp/me?with-lampa`,
                { credentials: "include" }
            ).then(response => response.json()).catch(() => null)

            const userDeviceName = decodeURIComponent(user.deviceName || '');
            const userAuthKey = user.lampaAuthKey || '';

            const deviceName = localStorage.getItem('device_name') || '';
            const lampacUnicId = localStorage.getItem('lampac_unic_id') || '';
         
            if (userDeviceName !== deviceName || userAuthKey !== lampacUnicId) {
                console.info('Device name or lampac unic ID mismatch.');
                localStorage.setItem('device_name', userDeviceName);
                localStorage.setItem('lampac_unic_id', userAuthKey);
                needToReload = true;
                break;
            }

            console.info('Successfully verified device name and lampac unicId.');
            break;
        } catch (e) {
            console.error('Error in modification script:', e);
            await sleep(500);
        }
    }

    // Reinitialize localStorage
    const userInitializerVersion = localStorage.getItem('lampa_modification_version')
    if (userInitializerVersion !== initializerVersion) {
        needToReload = true;
        const lampaAccount = localStorage.getItem('account') || '';
        const lampaAccountEmail = localStorage.getItem('account_email') || '';
        const language = localStorage.getItem('language') || 'ru';

        localStorage.clear();
        localStorage.setItem('account', lampaAccount);
        localStorage.setItem('account_email', lampaAccountEmail);
        localStorage.setItem('lampa_modification_version', initializerVersion);
        localStorage.setItem('lampa_modification_inited', 'false');
        localStorage.setItem('language', language);
    }

    // Initialize
    else if (localStorage.getItem('lampa_modification_inited') === 'false') {
        needToReload = true;
        localStorage.setItem('lampa_modification_inited', 'true');
        localStorage.setItem('proxy_tmdb', 'true');
    }

    // Reload if needed
    if (needToReload) {
        console.info('Reloading page due to changes.');
        location.reload();
    }
})();