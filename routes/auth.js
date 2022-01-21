const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model("User")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { JWT_TOKEN } = require('../config/keys')
const requireLogin = require('../middleware/requireLogin')


router.post('/signup', (req, res) => {
	const { name, email, password, pic } = req.body
	if (!email || !password || !name) {
		return res.status(422).json({ error: "giving all the fiels is necessary" })
	}
	else {
		User.findOne({ email: email })
			.then((savedUser) => {
				if (savedUser) {
					return res.status(422).json({ error: 'user already exist' })
				}
				else {
					bcrypt.hash(password, 12)
						.then(hashedPassword => {
							const user = new User({
								email,
								password: hashedPassword,
								name,
								pic
							})
							user.save()
								.then(user => {
									res.status(200).json({ message: "Sign up sucessfull" })
								})
								.catch(err => {
									console.log(err)
								})
						})


				}
			}).catch(err => {
				console.log(err)
			})
	}
})

router.post('/signin', (req, res) => {
	const { email, password } = req.body
	console.log("log in deails", req.body)
	if (!email || !password) {
		console.log('email', email)
		return res.json({ error: "email or password is wrong" })
	}

	User.findOne({ email: email })
		.then(savedUser => {
			if (!savedUser) {
				res.status(400).json({ err: "User does not exist" })
			}
			bcrypt.compare(password, savedUser.password)
				.then(doMatch => {
					if (doMatch) {
						const token = jwt.sign({ _id: savedUser._id }, JWT_TOKEN)
						const { _id, name, email, followers, following, pic } = savedUser
						res.json({ token, user: { _id, name, email, followers, following } })
					}
					else {
						return res.status(422).json({ error: "Invalid Email or passwoord" })
					}
				})
		})
		.catch(err => {
			console.log(err)
		})
})

module.exports = router