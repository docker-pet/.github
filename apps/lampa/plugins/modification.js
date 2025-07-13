(async () => {
    const initializerVersion = 'v0.0.1';
    let needToReload = false;

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
                `${url.protocol}//${parentDomain}/api/otp/me`,
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
            await new Promise(resolve => setTimeout(resolve, 500));
        }
    }

    // Initializer
    const userInitializerVersion = localStorage.getItem('lampa_modification_version')
    if (userInitializerVersion !== initializerVersion) {
        needToReload = true;
        const lampaAccount = localStorage.getItem('account') || '';
        const lampaAccountEmail = localStorage.getItem('account_email') || '';

        localStorage.clear();
        localStorage.setItem('account', lampaAccount);
        localStorage.setItem('account_email', lampaAccountEmail);
        localStorage.setItem('lampa_modification_version', initializerVersion);
    }

    // Reload if needed
    if (needToReload) {
        console.info('Reloading page due to changes.');
        location.reload();
    }
})();