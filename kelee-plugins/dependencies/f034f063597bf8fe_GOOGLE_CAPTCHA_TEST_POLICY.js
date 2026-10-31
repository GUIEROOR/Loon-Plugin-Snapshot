const $ = new NobyDa_Tools();
$.ret = {};

!(async () => {
    const policy = await $.policy();
    const regexText = JSON.parse($.data.read('GOOGLE_CAPTCHA') || '{}').RegexTest || '';
    const selected = [...policy.group, ...policy.proxy]
        .filter((n) => n && new RegExp(regexText).test(n))
        .sort(() => Math.random() - 0.5).slice(0, 20); // prevent too many TCP, filtered to random select up to 20
    console.log(`[INFO]: Test policy match: ${JSON.stringify(selected, null, 2)}`);
    $.notify('GOOGLE_CAPTCHA', '', JSON.stringify(selected))
})()
    .catch((err) => console.log(`[ERROR]: ${(err && err.message) || err}`))
    .finally(() => $done($.ret));


function NobyDa_Tools() {
    this.isLoon = typeof $loon !== "undefined";
    this.isQuanX = typeof $configuration !== 'undefined';
    this.isSurge = typeof $environment !== 'undefined' && $environment['surge-version'];
    this.policy = () => {
        if (this.isSurge) return new Promise((r) => {
            $httpAPI("GET", "v1/policies", null, (v) => r({
                proxy: v.proxies,
                group: v['policy-groups']
            }))
        });
        if (this.isQuanX) return new Promise((r) => {
            $configuration.sendMessage({
                action: "get_customized_policy"
            }).then(b => r({
                proxy: Object.keys(b.ret)
                    .reduce((t, i) => [...new Set([...t, ...b.ret[i].candidates || []])], [])
                    .filter((v) => !b.ret[v] && !['direct', 'proxy', 'reject'].includes(v)),
                group: Object.keys(b.ret)
            }), () => r({}));
        });
        if (this.isLoon) return new Promise(async (r1) => {
            const config = JSON.parse($config.getConfig());
            const groupData = await Promise.all(config['all_policy_groups'].map((i) => new Promise((r2) => {
                $config.getSubPolicies(i, (b) => { r2(JSON.parse(b || '[]')) })
            })));
            r1({
                proxy: groupData.reduce((t, i) => [...new Set([...t, ...i.filter((v) => {
                    return v.type == 'node' && !config['all_buildin_nodes'].includes(v.name)
                }).map((n) => n.name)])], []),
                group: config['all_policy_groups']
            })
        });
    };
    this.data = Object.fromEntries(['read', 'write'].map(
        (i) => [i, (v1, v2) => {
            if (i === 'write') {
                if (this.isSurge || this.isLoon) return $persistentStore.write(v1, v2);
                if (this.isQuanX) return $prefs.setValueForKey(v1, v2);
            } else if (i === 'read') {
                if (this.isSurge || this.isLoon) return $persistentStore.read(v1);
                if (this.isQuanX) return $prefs.valueForKey(v1);
            }
        }]
    ));
    this.notify = (title, subtitle, message) => {
		if (this.isQuanX) $notify(title, subtitle, message)
		if (this.isSurge || this.isLoon) $notification.post(title, subtitle, message)
	};
}