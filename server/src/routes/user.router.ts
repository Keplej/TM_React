import express, { Router } from "express"
const router = express.Router();
import { User } from "../models/user.model";
import { registerHandler } from "../controller/user.controller";


const authRoutes = Router();

authRoutes.post('/register', registerHandler)


// Get all users
router.get('/getUsers', async (req, res) => {
    try {
        const data = await User.find({}); // finds everyone
        console.log('Users retrieved!')
        res.status(200).json(data)
    } catch(e) {
        console.log(`Error with retrieving users: ${e}`);
    }
});

router.post('/registerUser', async (req, res) => {
    try {
        const data = await User.create(req.body);
        console.log('A user has been registered');
        res.status(200).json(data);
    } catch(e) {
        console.log(`Error registering User: ${e}`);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const data = await User.findById(req.params.id); // finds everyone
        console.log('User retrieved!')
        res.status(200).json(data)
    } catch(e) {
        console.log(`Error with retrieving a user: ${e}`);
    }
});

export { router };