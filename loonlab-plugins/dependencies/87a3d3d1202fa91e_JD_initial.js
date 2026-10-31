var $ = $$()
var key = ["JD_DailyBonusTimeOut", "JD_DailyBonusDelay", "JD_Retry_disable", "JD_Follow_disable", "JD_Crash_disable", "JD_DailyBonusLog", "JD_DailyBonusDisables", "JD_Crash_JD3C", "JD_Crash_JDSubsidy", "JD_Crash_JDClocks", "JD_Crash_JDDrug", "JD_Crash_JDVege", "JD_Crash_JDFood", "JD_Crash_JDClean", "JD_Crash_JDCare", "JD_Crash_JDJewels", "JD_Crash_JDShand", "JD_Crash_JDWomen", "JD_Crash_JDGStore", "JD_Crash_JDPet", "JD_Crash_JDBook", "JD_Crash_JDMakeup", "JD_Crash_JDTreasure", "JD_Crash_JDBaby"]

key.forEach(i => {
  console.log(`${i} 旧值: ${$.read(i)}`)
  $.write('', i)
})
$.notify('京东签到', '', '初始化京东BoxJS设置成功, 请手动刷新BoxJs页面')
$.done()

function $$() {
  const isRequest = typeof $request != "undefined"
  const isSurge = typeof $httpClient != "undefined"
  const isQuanX = typeof $task != "undefined"
  const isLoon = typeof $loon != "undefined"
  const read = (key) => {
    if (isQuanX) return $prefs.valueForKey(key)
    if (isSurge) return $persistentStore.read(key)
  }
  const write = (value, key) => {
    if (isQuanX) return $prefs.removeValueForKey(key)
    if (isLoon) return $persistentStore.write('', key)
    if (isSurge) return $persistentStore.write(null, key)
  }
  const notify = (title, subtitle, message) => {
    if (isQuanX) $notify(title, subtitle, message)
    if (isSurge) $notification.post(title, subtitle, message)
  }
  const done = (value = {}) => {
    if (isQuanX) $done(value)
    if (isSurge) isRequest ? $done(value) : $done()
  }
  return {
    notify,
    read,
    write,
    done
  }
}