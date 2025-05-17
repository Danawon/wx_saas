let { envVersion } = __wxConfig;
let baseUrlObj = {
	// develop: 'https://devapi.hansifit.com', // 开发环境
	develop: 'https://devsaas.hansifit.com', // 开发环境
	// trial: 'https://api.hansifit.com', // 体验环境
	trial: 'https://devsaas.hansifit.com', // 体验环境
	release: 'https://devsaas.hansifit.com', // 生产环境
}
let baseUrl = `http://cdn.hansifit.com/20220707/`
let baseUrlApi = `${baseUrlObj[envVersion]}/api/`
export  {
	baseUrl,
	baseUrlApi
}