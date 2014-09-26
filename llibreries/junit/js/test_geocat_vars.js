var HOST_APP = "http://localhost:8080/geocat/";
var urls = {
	login: HOST_APP+"login.action?",
	createUser: HOST_APP+"admin/createUser.action?",
	registreUser: HOST_APP+"registreUser.action?",
	validateUid: HOST_APP+"validateUid.action?",
	validateEmail: HOST_APP+"validateEmail.action?",
	getUser: HOST_APP+"admin/getUser.action?",
	updatePassword: HOST_APP+"user/updatePassword.action?",
	updateUser: HOST_APP+"user/updateUser.action?",
	updateUserOptions: HOST_APP+"user/updateUserOptions.action?",
	getUserUser: HOST_APP+"user/getUser.action?",
	getAllUsers: HOST_APP+"admin/getAllUsers.action?",
	getAllUserNames: HOST_APP+"admin/getAllUserNames.action?",
	deleteUser: HOST_APP+"admin/deleteUser.action?",
	logout: HOST_APP+"logout.action?",
	createAmbitGeo: HOST_APP+"admin/createAmbitGeo.action?",
	updateAmbitGeo: HOST_APP+"admin/updateAmbitGeo.action?",
	deleteAmbitGeo: HOST_APP+"admin/deleteAmbitGeo.action?",
	getAllAmbitGeo: HOST_APP+"admin/getAllAmbitGeo.action?",
	getAmbitGeoById: HOST_APP+"admin/getAmbitGeoById.action?",
	getAmbitGeoByBusinessId: HOST_APP+"admin/getAmbitGeoByBusinessId.action?",
	createTipusAplicacio: HOST_APP+"admin/createTipusAplicacio.action?",
	updateTipusAplicacio: HOST_APP+"admin/updateTipusAplicacio.action?",
	deleteTipusAplicacio: HOST_APP+"admin/deleteTipusAplicacio.action?",
	getAllTipusAplicacio: HOST_APP+"admin/getAllTipusAplicacio.action?",
	getTipusAplicacioById: HOST_APP+"admin/getTipusAplicacioById.action?",
	getTipusAplicacioByBusinessId: HOST_APP+"admin/getTipusAplicacioByBusinessId.action?",
	createTipusEntitat: HOST_APP+"admin/createTipusEntitat.action?",
	updateTipusEntitat: HOST_APP+"admin/updateTipusEntitat.action?",
	deleteTipusEntitat: HOST_APP+"admin/deleteTipusEntitat.action?",
	getAllTipusEntitat: HOST_APP+"admin/getAllTipusEntitat.action?",
	getTipusEntitatById: HOST_APP+"admin/getTipusEntitatById.action?",
	getTipusEntitatByBusinessId: HOST_APP+"admin/getTipusEntitatByBusinessId.action?",
	createTipusOrigin: HOST_APP+"admin/createTipusOrigin.action?",
	updateTipusOrigin: HOST_APP+"admin/updateTipusOrigin.action?",
	deleteTipusOrigin: HOST_APP+"admin/deleteTipusOrigin.action?",
	getAllTipusOrigin: HOST_APP+"admin/getAllTipusOrigin.action?",
	getTipusOriginById: HOST_APP+"admin/getTipusOriginById.action?",
	createUserSocial: HOST_APP+"user/createUserSocial.action?",
	updateUserSocial: HOST_APP+"user/updateUserSocial.action?",
	getAllUserSocial: HOST_APP+"user/getAllUserSocial.action?",
	deleteUserSocial: HOST_APP+"user/deleteUserSocial.action?",
	createMap: HOST_APP+"aplications/map/createMap.action?",
	updateMap: HOST_APP+"aplications/map/updateMap.action?",
	updateMap: HOST_APP+"aplications/map/updateMap.action?",
	updateMapName: HOST_APP+"aplications/map/updateMapName.action?",
	deleteMap: HOST_APP+"aplications/map/deleteMap.action?",
	getMapById: HOST_APP+"aplications/map/getMapById.action?",
	getAllMapsByUser: HOST_APP+"aplications/map/getAllMapsByUser.action?",
	getAllPublicsMapsByUser: HOST_APP+"aplications/map/getAllPublicsMapsByUser.action?",
	getAllMaps: HOST_APP+"aplications/map/getAllMaps.action?",
	getAllPublicsMaps: HOST_APP+"aplications/map/getAllPublicsMaps.action?",
	addServerToMap: HOST_APP+"aplications/map/addServerToMap.action?",
	updateServerToMap: HOST_APP+"aplications/map/updateServerToMap.action?",
	updateServersOrderToMap: HOST_APP+"aplications/map/updateServersOrderToMap.action?",
	removeServerToMap: HOST_APP+"aplications/map/removeServerToMap.action?",
	createServidorWMS: HOST_APP+"layers/servidor/wms/createServidorWMS.action?",
	createServidorInMap: HOST_APP+"layers/servidor/wms/createServidorInMap.action?",
	getServidorWMSByBusinessId: HOST_APP+"layers/servidor/wms/getServidorWMSByBusinessId.action?",
	updateServidorWMS: HOST_APP+"layers/servidor/wms/updateServidorWMS.action?",
	updateServidorWMSName: HOST_APP+"layers/servidor/wms/updateServidorWMSName.action?",
	getAllServidorsWMSByUser: HOST_APP+"layers/servidor/wms/getAllServidorsWMSByUser.action?",
	getAllPubliscServidorsWMSByUser: HOST_APP+"layers/servidor/wms/getAllPubliscServidorsWMSByUser.action?",
	getAllPublicsServidorsWMS: HOST_APP+"layers/servidor/wms/getAllPublicsServidorsWMS.action?",
	getAllServidorsWMS: HOST_APP+"layers/servidor/wms/getAllServidorsWMS.action?",
	deleteServidorWMS: HOST_APP+"layers/servidor/wms/deleteServidorWMS.action?",
	createFeatureLayer: HOST_APP+"layers/feature/createFeatureLayer.action?",
	updateFeatureLayer: HOST_APP+"layers/feature/updateFeatureLayer.action?",
	deleteFeatureLayer: HOST_APP+"layers/feature/deleteFeatureLayer.action?",
	createFeature: HOST_APP+"layers/feature/createFeature.action?",
	updateFeature: HOST_APP+"layers/feature/updateFeature.action?",
	deleteFeature: HOST_APP+"layers/feature/deleteFeature.action?",
	getAllFeatureLayersByUser: HOST_APP+"layers/feature/getAllFeatureLayersByUser.action?",
	getFeatureLayersByBusinessId: HOST_APP+"layers/feature/getFeatureLayersByBusinessId.action?",
	createDataLayer: HOST_APP+"layers/data/createDataLayer.action?",
	updateDataLayer: HOST_APP+"layers/data/updateDataLayer.action?",
	deleteDataLayer: HOST_APP+"layers/data/deleteDataLayer.action?",
	createData: HOST_APP+"layers/data/createData.action?",
	updateData: HOST_APP+"layers/data/updateData.action?",
	deleteData: HOST_APP+"layers/data/deleteData.action?",
	getAllDataLayersByUser: HOST_APP+"layers/data/getAllDataLayersByUser.action?",
	createTematicLayer: HOST_APP+"layers/tematic/createTematicLayer.action?",
	updateTematicLayer: HOST_APP+"layers/tematic/updateTematicLayer.action?",
	deleteTematicLayer: HOST_APP+"layers/tematic/deleteTematicLayer.action?",
	createRang: HOST_APP+"layers/tematic/createRang.action?",
	updateRang: HOST_APP+"layers/tematic/updateRang.action?",
	deleteRang: HOST_APP+"layers/tematic/deleteRang.action?",
	updateTematicRangs: HOST_APP+"layers/tematic/updateTematicRangs.action?",
	duplicateTematicLayer: HOST_APP+"layers/tematic/duplicateTematicLayer.action?",
	updateGeometriesTematicLayer: HOST_APP+"layers/tematic/updateGeometriesTematicLayer.action?",
	updateCapesTematicLayer: HOST_APP+"layers/tematic/updateCapesTematicLayer.action?",
	getTematicLayerByBusinessId: HOST_APP+"layers/tematic/getTematicLayerByBusinessId.action?",
	createTematicLayerFeature: HOST_APP+"layers/tematic/createTematicLayerFeature.action?",
	createTematicLayerEmpty: HOST_APP+"layers/tematic/createTematicLayerEmpty.action?",
	moveFeatureToTematic: HOST_APP+"layers/tematic/moveFeatureToTematic.action?",
	deleteTematicLayerAll: HOST_APP+"layers/tematic/deleteTematicLayerAll.action?",
	getAllTematicLayerByUid: HOST_APP+"layers/tematic/getAllTematicLayerByUid.action?",
	createGeometriesColleccioLayer: HOST_APP+"layers/geometriesColleccio/createGeometriesColleccioLayer.action?",
	updateGeometriesColleccioLayer: HOST_APP+"layers/geometriesColleccio/updateGeometriesColleccioLayer.action?",
	getAllGeometriesColleccioByUser: HOST_APP+"layers/geometriesColleccio/getAllGeometriesColleccioByUser.action?",
	getGeometriesColleccioLayersByBusinessId: HOST_APP+"layers/geometriesColleccio/getGeometriesColleccioLayersByBusinessId.action?",
	createGeometria: HOST_APP+"layers/geometriesColleccio/createGeometria.action?",
	updateGeometria: HOST_APP+"layers/geometriesColleccio/updateGeometria.action?",
	deleteGeometria: HOST_APP+"layers/geometriesColleccio/deleteGeometria.action?",
	deleteGeometriesColleccioLayer: HOST_APP+"layers/geometriesColleccio/deleteGeometriesColleccioLayer.action?",
	
	createVisualitzacioLayer: HOST_APP+"layers/visualitzacio/createVisualitzacioLayer.action?",
	updateVisualitzacioLayer: HOST_APP+"layers/visualitzacio/updateVisualitzacioLayer.action?",
	getVisualitzacioByBusinessId: HOST_APP+"layers/visualitzacio/getVisualitzacioByBusinessId.action?",
	getAllVisualitzacioByBusinessId: HOST_APP+"layers/visualitzacio/getAllVisualitzacioByBusinessId?",
	getAllVisualitzacioLayerByUid: HOST_APP+"layers/visualitzacio/getAllVisualitzacioLayerByUid.action?",
	addGeometriaToVisualitzacio: HOST_APP+"layers/visualitzacio/addGeometriaToVisualitzacio.action?",
	moveGeometriaToVisualitzacio: HOST_APP+"layers/visualitzacio/moveGeometriaToVisualitzacio.action?",
	duplicateVisualitzacioLayer: HOST_APP+"layers/visualitzacio/duplicateVisualitzacioLayer.action?",
	deleteVisualitzacioLayer: HOST_APP+"layers/visualitzacio/deleteVisualitzacioLayer.action?",
	deleteVisualitzacioLayerAll: HOST_APP+"layers/visualitzacio/deleteVisualitzacioLayerAll.action?",
};

var uid = "bolo";

//var JSV = require("./jsv").JSV;
var JSV = require("JSV").JSV;
var test_uid = "bcarmona";
var env = JSV.createEnvironment();