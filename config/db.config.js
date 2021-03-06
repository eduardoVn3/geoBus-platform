'use strict'
import env from './env'
import Sequelize from 'sequelize'

const SEQUELIZE = new Sequelize(
	env.database, 
	env.username, 
	env.password, 
	{
	  // logging:false,
	  host: env.host,
	  dialect: env.dialect,
	  operatorsAliases: false,

	  pool: {
	    max: env.max,
	    min: env.pool.min,
	    acquire: env.pool.acquire,
	    idle: env.pool.idle
	},
	  dialectOptions: {
	      charset: 'utf8mb4',
	      collate: 'utf8mb4_general_ci'
	    },
});

const DB = {};

DB.Sequelize = Sequelize;
DB.SEQUELIZE = SEQUELIZE;

//Models/tables
DB.Rol = require('../models/rol.js')(SEQUELIZE,Sequelize);
DB.Company = require('../models/company.js')(SEQUELIZE,Sequelize);
DB.TransportUnit = require('../models/transportunit.js')(SEQUELIZE,Sequelize);
DB.Driver = require('../models/driver.js')(SEQUELIZE,Sequelize);
DB.Drivers_transportsUnit = require('../models/drivers_transportunit.js')(SEQUELIZE,Sequelize);
DB.Route = require('../models/route.js')(SEQUELIZE,Sequelize);
DB.User = require('../models/user.js')(SEQUELIZE,Sequelize);
DB.FavoritePlace = require('../models/favoriteplace.js')(SEQUELIZE,Sequelize);
DB.TypeFavoritePlace = require('../models/typefavoriteplace.js')(SEQUELIZE,Sequelize);
DB.Coordinate = require('../models/coordinate.js')(SEQUELIZE,Sequelize);
DB.CoordinateDetail = require('../models/coordinatedetail.js')(SEQUELIZE,Sequelize);
DB.TravelProgramming = require('../models/travelprogramming.js')(SEQUELIZE,Sequelize);
//associations

//company and trasport unit one-to-many
DB.Company.hasMany(DB.TransportUnit,{ foreignKey: 'company_id', sourceKey: 'id'})
DB.TransportUnit.belongsTo(DB.Company,{ foreignKey: 'company_id', targetKey: 'id'})

//company and driver one-to-many
DB.Company.hasMany(DB.Driver,{ foreignKey: 'company_id', sourceKey: 'id'})
DB.Driver.belongsTo(DB.Company,{ foreignKey: 'company_id', targetKey: 'id'})

//company and route one-to-many
DB.Company.hasMany(DB.Route,{ foreignKey: 'company_id', sourceKey: 'id'})
DB.Route.belongsTo(DB.Company,{ foreignKey: 'company_id', targetKey: 'id'})

//driver and trasport unit many-to-many
DB.Driver.belongsToMany(DB.TransportUnit, {through: DB.Drivers_transportsUnit, foreignKey: 'driver_id'});
DB.TransportUnit.belongsToMany(DB.Driver, {through: DB.Drivers_transportsUnit, foreignKey: 'transportUnit_id'});

//user and favorite places one-to-many
DB.User.hasMany(DB.FavoritePlace,{ foreignKey: 'user_id', sourceKey: 'id'})
DB.FavoritePlace.belongsTo(DB.User,{ foreignKey: 'user_id', targetKey: 'id'})

//favorite place and type favorite place one-to-one
DB.FavoritePlace.belongsTo(DB.TypeFavoritePlace, {foreignKey: 'type_place', targetKey: 'id'});

//favorite place and coordenite detail one-to-one
DB.FavoritePlace.belongsTo(DB.CoordinateDetail, {foreignKey: 'coodinateDetail_id', targetKey: 'id'});

//coordinate and coordinate detail one-to-one
DB.CoordinateDetail.belongsTo(DB.Coordinate, {foreignKey: 'coordinate_id', targetKey: 'id'});

//travel programming and coordinate detail
//output_coordinate
DB.TravelProgramming.belongsTo(DB.CoordinateDetail, {foreignKey: 'outputCoordinate_id', targetKey: 'id'});
//arrival_cooridnate
DB.TravelProgramming.belongsTo(DB.CoordinateDetail, {foreignKey: 'arrivalCoordinate_id', targetKey: 'id'});
//nearestStationCoordinate_id
DB.TravelProgramming.belongsTo(DB.CoordinateDetail, {foreignKey: 'nearestStationCoordinate_id', targetKey: 'id'});

//user and travel programming one-to-many
DB.User.hasMany(DB.TravelProgramming,{ foreignKey: 'user_id', sourceKey: 'id'})
DB.TravelProgramming.belongsTo(DB.User,{ foreignKey: 'user_id', targetKey: 'id'})

export default DB;