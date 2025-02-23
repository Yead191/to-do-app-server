require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
const express = require('express');
const cors = require('cors');
const app = express()
const port = process.env.PORT || 5000



//middleware
app.use(express.json())
app.use(cors())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pjwkg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();

        const userCollection = client.db('ToDo-DB').collection('users')
        const taskCollection = client.db('ToDo-DB').collection('tasks')


        // users

        app.post('/users', async (req, res) => {
            const user = req.body
            const query = { email: user.email }
            const isExist = await userCollection.findOne(query)
            if (isExist) {
                return res.send({ message: 'User already exists', insertedId: null })
            }
            const result = await userCollection.insertOne(user)
            res.send(result)
        })
        app.get('/users', async (req, res) => {
            const result = await userCollection.find().toArray()
            res.send(result)
        })

        app.put('/users/profile/:id', async (req, res) => {
            const id = req.params.id
            const userInfo = req.body
            if (!id || !ObjectId.isValid(id)) {

                const result = await userCollection.insertOne(userInfo);
                return res.send(result);
            }
            // console.log(id, userInfo);
            const query = { _id: new ObjectId(id) }
            const updatedDoc = {
                $set: {
                    name: userInfo.name,
                    mobile: userInfo.mobile,
                    photoURL: userInfo.photoURL
                }
            }
            const options = { upsert: true };
            const result = await userCollection.updateOne(query, updatedDoc, options)
            res.send(result)
        })
        app.get('/user', async (req, res) => {
            const email = req.query.email
            const query = { email: email }
            const result = await userCollection.findOne(query)
            // console.log(result);
            res.send(result)
        })



        // task management
        app.post('/tasks', async (req, res) => {
            const task = req.body
            const result = await taskCollection.insertOne(task)
            res.send(result)
        })
        app.get('/tasks', async (req, res) => {
            const email = req.query.email
            const result = await taskCollection.find({ email }).toArray()
            res.send(result)
        })
        app.put('/tasks/:id', async (req, res) => {
            const { id } = req.params;
            const { category } = req.body;



            const task = await taskCollection.findOne({ _id: new ObjectId(id) });

            if (!task) {
                return res.status(404).json({ message: 'Task not found' });
            }


            if (task.category === category) {

                return res.status(400).json({ message: 'Task is already in this category' });
            }

            const result = await taskCollection.updateOne(
                { _id: new ObjectId(id) },
                { $set: { category } }
            );

            if (result.matchedCount === 0) {
                return res.status(404).json({ message: 'Task not found' });
            }
            res.json({ message: 'Category updated successfully' });
        });



        app.delete('/tasks/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await taskCollection.deleteOne(query)
            res.send(result)
        })


        app.get('/my-tasks/today/:email', async (req, res) => {
            const email = req.params.email;
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const tasks = await taskCollection.find({ email }).toArray();
            const todayTasks = tasks.filter(task => {
                const taskDate = new Date(task.date);
                taskDate.setHours(0, 0, 0, 0);
                return taskDate.getTime() === today.getTime();
            });


            res.send(todayTasks);
        })

        app.get('/my-tasks/upcoming/:email', async (req, res) => {
            const email = req.params.email;

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const tasks = await taskCollection.find({ email }).toArray();


            const upcomingTasks = tasks.filter(task => {
                const taskDate = new Date(task.date);
                taskDate.setHours(0, 0, 0, 0);
                return taskDate.getTime() > today.getTime();
            });


            res.send(upcomingTasks);
        })

        app.patch('/my-task/update/:id', async (req, res) => {
            const id = req.params.id
            const updatedTask = req.body
            const filter = { _id: new ObjectId(id) }
            const updatedDoc = {
                $set: {
                    title: updatedTask.title,
                    description: updatedTask.description,
                    date: updatedTask.date,
                    category: updatedTask.category
                }
            }
            const result = await taskCollection.updateOne(filter, updatedDoc)
            res.send(result)

        })


        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        // console.log("Pinged your deployment. You successfully connected to MongoDB!");


    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Daily To-do server running')
})
app.listen(port, () => {
    console.log('server running on:', port);
})



