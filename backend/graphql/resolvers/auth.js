const User = require('../../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


module.exports = {


    login: async ({ email, password }) => {
        
        const user = await User.findOne({ email: email })

        if (!user) 
            throw new Error ('user does not exist')

        const isEqual = await bcrypt.compare(password, user.password)

        if(!isEqual)
            throw new Error('password is not correct')
        
        const token = await jwt.sign({userId: user.id, email: user.email}, 'somesupersecretkey', {
            exoiresIn: '1h'
        })

        return {
            userId: user.id,
            token: token,
            tokenExpiration: 1
        }
    },

    createUser: async args => {
        
        try {
            const existingUser = await User.findOne({email: args.userInput.email })
            if(existingUser) {
                throw new Error('user exist')
            }
            const hashedPassword = await bcrypt.hash(args.userInput.password, 12)
            const user = new User({
                email: args.userInput.email,
                password: hashedPassword
            })
            const result = await user.save()
            return { ...result._doc, _id:result.id, password: null }
        }
        catch(err) {
            throw err
        }
    },

}