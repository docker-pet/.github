(async () => {
    const url = new URL(location.href);
    const parentDomain = url.hostname.replace(/^[^.]+\./, '');
    const retryLimit = 10;
    let retryCount = 0;

    while (true) {
        if (retryCount++ < retryLimit) {
            console.error('Retry limit reached, stopping the script.');
            break;
        }

        try {
            const user = await fetch(`${url.protocol}//${parentDomain}/api/lampa/user`)
                .then(response => response.json())
                .catch(() => null);

            const deviceName = localStorage.getItem('device_name') || '';
            const lampacUnicId = localStorage.getItem('lampac_unic_id') || '';
         
            if (user.deviceName !== deviceName || user.authKey !== lampacUnicId) {
                console.infi('Device name or lampac unic ID mismatch.');
                localStorage.setItem('device_name', user.deviceName);
                localStorage.setItem('lampac_unic_id', user.authKey);
                location.reload();
                break;
            }

            console.info('Successfully verified device name and lampac unicId.');
        } catch (e) {
            console.error('Error in modification script:', e);
            await new Promise(resolve => setTimeout(resolve, 500));
        }
    }
})();