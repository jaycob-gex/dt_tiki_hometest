const mongodb = require('mongodb')
const MongoClient = require('mongodb').MongoClient
const bcrypt = require('bcrypt')
const config = require('config')

async function connect() {
    try{
        let db = await MongoClient.connect(config.get('mongodb.uri'), { useNewUrlParser: true });

        let dbo = db.db(config.get('mongodb.name'))

        return {
            db,
            dbo
        }
    }
    catch(err) {
        return Promise.reject(err)
    }
}

module.exports = {
    getAllBooks: async () => {
        const {db, dbo} = await connect()

        return new Promise((resolve, reject) => {
            try {
                const results = dbo.collection(config.get('mongodb.booksCollection')).find().limit(100).toArray()
                resolve(results)
            }
            catch(err) {
                reject(new Error(err))
            }
            finally {
                db.close()
            }
        })
    },

    addBook: async (book) => {
        const {db, dbo} = await connect()

        return new Promise((resolve, reject) => {
            let result = null

            try {
                result = dbo.collection(config.get('mongodb.booksCollection')).insertOne(book)
                resolve(result)
            }
            catch(err) {
                reject(new Error(err))
            }
            finally {
                db.close()
            }
            
        })
    },

    editBook: async (bookId, book) => {
        const {db, dbo} = await connect()

        return new Promise((resolve, reject) => {
            let result = null

            try {
                result = dbo.collection(config.get('mongodb.booksCollection')).updateOne(
                    {
                    _id: new mongodb.ObjectID(bookId)
                    },
                    {
                        $set: book
                    }
                )
                resolve(result)
            }
            catch(err) {
                reject(new Error(err))
            }
            finally {
                db.close()
            }
            
        })
    },

    deleteBook: async (bookId) => {
        const {db, dbo} = await connect()

        return new Promise((resolve, reject) => {
            let result = null

            try {
                result = dbo.collection(config.get('mongodb.booksCollection')).deleteOne({
                    _id: new mongodb.ObjectID(bookId)
                })
                resolve(result)
            }
            catch(err) {
                reject(new Error(err))
            }
            finally {
                db.close()
            }
            
        })
    },

    findUser: async (username, password) => {
        const {db, dbo} = await connect()

        return new Promise(async (resolve, reject) => {
            const result = await dbo.collection(config.get('mongodb.usersCollection')).findOne({
                username
            })

            // compare user password vs hashed password stored in db
            if(result) {
                bcrypt.compare(password, result.password, (err, isSame) => {
                    if(err) reject(new Error(err))

                    isSame ? resolve(result) : reject(new Error('Incorrect Password!'))
                })
            } else {
                reject(new Error('No user found!'))
            }

            db.close()
        })
    }
}