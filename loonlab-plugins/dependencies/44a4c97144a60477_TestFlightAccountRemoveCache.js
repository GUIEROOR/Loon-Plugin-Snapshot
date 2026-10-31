const env = typeof $prefs == 'undefined';
const notify = (a, b, c) => env ? $notification.post(a, b, c) : $notify(a, b, c);
const read = (a) => env ? $persistentStore.read(a) : $prefs.valueForKey(a);
const write = (a, b) => env ? $persistentStore.write(a, b) : $prefs.setValueForKey(a, b);
const remove = (a) => env ? $persistentStore.write(null, a) : $prefs.removeValueForKey(a);
const data = JSON.parse(read('TESTFLIGHT-ACCOUNT') || '{}') || {};
Object.keys(data.CachedInfo || {}).forEach((i) => {
    console.log(`REMOVE: ${i}\n`);
    remove(data.CachedInfo[i].key);
    delete data.CachedInfo[i]
});

remove('TESTFLIGHT-ACCOUNT-CACHE');
write(JSON.stringify(data, null, 2), 'TESTFLIGHT-ACCOUNT');
notify('TESTFLIGHT-ACCOUNT', '', 'CACHE REMOVED !');
$done({});