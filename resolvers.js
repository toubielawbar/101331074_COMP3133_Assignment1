// Resolvers
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const Employee = require('./models/Employee');

const resolvers = {

    signup: async (args) => {
        try {
            const { username, email, password } = args; 

            // Check if email already exists
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                throw new Error('Email already exists');
            }
            
            // Create new user
            const hashedPassword = await bcrypt.hash(password, 10);
            let user = new User({ username, email, password: hashedPassword });
            
            let newUser = await user.save();
            return newUser;
        } catch (error) {
            throw error;
        }
    },

    login: async (args) => {
        try {
            const { email, password } = args;

            // Find user by email
            const user = await User.findOne({ email });
            if (!user) {
                throw new Error('User not found');
            }

            // Check if password is correct
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) {
                throw new Error('Invalid password');
            }

            const token = jwt.sign({ userId: user._id }, 'your_secret_key', { expiresIn: '1h' });

            return { token, user };
        } catch (error) {
            throw error;
        }
    },

    employees: async () => {
        try {
                const EmployeesFetch = await Employee.find();
                return EmployeesFetch;
             } catch (error) {
                throw error 
             }
    },
    createEmployee: async (args) => {
        try {
            const { first_name, last_name, email, gender, salary } = args; 

            // Check if email already exists
            const existingEmp = await Employee.findOne({ email });
            if (existingEmp) {
                throw new Error('Employee already exists');
            }
            
            // Create new employee
            const employee = new Employee({first_name, last_name, email, gender, salary})
            let newEmployee = await employee.save();
            return newEmployee;
        } catch (error) {
            throw error;
        }
    },
    employee: async (args) => {
        try {
                const EmployeeFetch = await Employee.findById(args.id);
                return EmployeeFetch;
             } catch (error) {
                throw error 
             }
    },

    updateEmployee: async (args) => {
        try {
            const { id, input } = args;
            const updatedEmployee = await Employee.findByIdAndUpdate(id, input, { new: true });
            return updatedEmployee;
        } catch (error) {
            throw error;
        }
    },
    deleteEmployee: async ({ id }) => {
        try {
            await Employee.findByIdAndDelete(id);
            return "Employee deleted successfully";
        } catch (error) {
            
            throw new Error("Failed to delete employee");
        }
    }
    
};

module.exports = resolvers;