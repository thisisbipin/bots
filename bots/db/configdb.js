import nedb from "nedb";

class DB {
	LOG_SYMBOL = "->";
	messages = {
		success: "DONE",
		failure: "See Database Logs",
	};
	constructor(name, DATABASE_URL) {
		this.databasename = name;
		this.database = new nedb(DATABASE_URL);
		this.database.loadDatabase();
		/* @log */ console.log(
			this.LOG_SYMBOL +
				" ( " +
				this.databasename +
				" ) " +
				`DB loaded successfully`
		);
	}
	insert = async (id, value) => {
		return new Promise((resolve, reject) => {
			const key_value = { property: id, value: value };
			this.database.insert(key_value, (err, data) => {
				if (err != null) {
					/* @log */ console.log(
						this.LOG_SYMBOL +
							" ( " +
							this.databasename +
							" ) " +
							`There was some error - ` +
							err
					);
					reject(this.messages.failure);
				} else {
					/* @log */ console.log(
						this.LOG_SYMBOL +
							" ( " +
							this.databasename +
							" ) " +
							`Data was Inserted Successfully` +
							key_value
					);
					resolve(this.messages.success);
				}
			});
		});
	};

	get = (id) => {
		return new Promise((resolve, reject) => {
			this.database.find({ property: id }, async (err, data) => {
				if (err != null) {
					/* @log */ console.log(
						this.LOG_SYMBOL +
							" ( " +
							this.databasename +
							" ) " +
							`Error Occured for ` +
							id
					);
					reject(this.messages.failure);
				} else if (data.length == 0) {
					reject(
						this.LOG_SYMBOL +
							" ( " +
							this.databasename +
							" ) " +
							`Data for the Given ID: ${id} was not found`
					);
				} else {
					/* @log */ console.log(
						this.LOG_SYMBOL +
							" ( " +
							this.databasename +
							" ) " +
							`Data was fetched for`,
						id,
						":",
						data[0].value
					);
					resolve(data[0].value);
				}
			});
		});
	};

	update = async (id, new_value) => {
		return new Promise((resolve, reject) => {
			const updated_value = { property: id, value: new_value };
			this.database.update(
				{ property: id },
				{ $set: { value: new_value } },
				{},
				(err, data) => {
					if (err != null) {
						/* @log */ console.log(
							this.LOG_SYMBOL +
								" ( " +
								this.databasename +
								" ) " +
								`There was some error - ` +
								err
						);
						reject(this.messages.failure);
					} else {
						/* @log */ console.log(
							this.LOG_SYMBOL +
								" ( " +
								this.databasename +
								" ) " +
								`Data was successfully set as`,
							updated_value
						);
						resolve(this.messages.success);
					}
					this.database.loadDatabase();
				}
			);
		});
	};
}

export const configdb = new DB("config", "./databases/config.db");
export const logsdb = new DB("logs", "./databases/logs.db");
