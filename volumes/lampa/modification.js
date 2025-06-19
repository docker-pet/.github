(async () => {
    const initializerVersion = 'v0.0.1';
    let needToReload = false;

    // Auth
    const retryLimit = 10;
    let retryCount = 0;
    while (true) {
        if (retryCount++ < retryLimit) {
            console.error('Retry limit reached, stopping the script.');
            break;
        }

        try {
            const url = new URL(location.href);
            const parentDomain = url.hostname.replace(/^[^.]+\./, '');

            const user = await fetch(`${url.protocol}//${parentDomain}/api/lampa/user`)
                .then(response => response.json())
                .catch(() => null);

            const deviceName = localStorage.getItem('device_name') || '';
            const lampacUnicId = localStorage.getItem('lampac_unic_id') || '';
         
            if (user.deviceName !== deviceName || user.authKey !== lampacUnicId) {
                console.infi('Device name or lampac unic ID mismatch.');
                localStorage.setItem('device_name', user.deviceName);
                localStorage.setItem('lampac_unic_id', user.authKey);
                needToReload = true;
                break;
            }

            console.info('Successfully verified device name and lampac unicId.');
        } catch (e) {
            console.error('Error in modification script:', e);
            await new Promise(resolve => setTimeout(resolve, 500));
        }
    }

    // Initializer
    const userInitializerVersion = localStorage.getItem('lampa_modification_version')
    if (userInitializerVersion !== initializerVersion) {
        needToReload = true;
        const lampaAccount = localStorage.getItem('account') || '{}';
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