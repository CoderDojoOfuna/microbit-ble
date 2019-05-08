// 加速度サービスUUID
const ACCELEROMETER_SERVICE_UUID = 'e95d0753-251d-470a-a062-fa1922dfa9a8';
// 加速度キャラクタリスティックUUID
const ACCELEROMETER_CHARACTERISTICS_UUID = 'e95dca4b-251d-470a-a062-fa1922dfa9a8';

let microbit = null;
let angle = null;

//画面をクリックしたらmicro:bitとBluetooth接続する
$(function()
{
	$('.player').css('top', $(window).height()/2+'px');
});
/* -----------------------------------------------
 * ペアリング開始
----------------------------------------------- */
function connect()
{
	console.log('connect');

	// BLEデバイスをスキャンする
	navigator.bluetooth.requestDevice({
		// acceptAllDevices: true,
		filters: [{
			namePrefix: 'BBC micro:bit'
		}],
		optionalServices: [ACCELEROMETER_SERVICE_UUID]
	})
	// デバイス接続する
	.then(device => {
		console.log(device);
		microbit = device;
		return device.gatt.connect();
	})
	// 加速度センササービスを取得する
	.then(server => {
		console.log(server);
		return server.getPrimaryService(ACCELEROMETER_SERVICE_UUID);
	})
	// キャラクタリスティックを取得する
	.then(service => {
		console.log(service);
		return service.getCharacteristic(ACCELEROMETER_CHARACTERISTICS_UUID);
	})
	// 加速度が変化したら指定したメソッドを呼び出す
	.then(characteristic => {
		console.log(characteristic);
		characteristic.startNotifications();
		characteristic.addEventListener('characteristicvaluechanged', accelerometerChanged);
	})
	.catch(error => {
		console.log(error);
	});
}
/* -----------------------------------------------
 * ペアリング解除
----------------------------------------------- */
function disconnect()
{
	console.log('disconnect');

	if (!microbit || !microbit.gatt.connected)
	{
		return;
	}
	microbit.gatt.disconnect();
}
/* -----------------------------------------------
 * 加速度センサの値が変化したら呼び出される
----------------------------------------------- */
function accelerometerChanged(event)
{
	// 加速度X座標
	let accelX = event.target.value.getInt16(0, true)/1000.0;
	// 加速度Y座標
	let accelY = event.target.value.getInt16(2, true)/1000.0;
	// 加速度Z座標
	let accelZ = event.target.value.getInt16(4, true)/1000.0;
	// 角度
	angle = Math.atan2(accelZ, accelX) * (180.0 / Math.PI);
	if (accelZ > 0)
	{
		angle = 360.0 - angle;
	}
	angle = Math.abs(angle);
	$('.x').text(accelX);
	$('.y').text(accelY);
	$('.z').text(accelZ);
	$('.angle').text(angle);

}
