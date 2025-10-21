import { Link } from 'react-router-dom';
import { ROUTES } from '../../utils';

function Register() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          Register
        </h1>
        <p className="text-gray-600 text-center mb-4">
          Registration form will be implemented in next chapter
        </p>
        <div className="space-y-4">
          <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">
            Register (Coming Soon)
          </button>
          <p className="text-center text-gray-600">
            Already have an account?{' '}
            <Link to={ROUTES.LOGIN} className="text-blue-600 hover:underline">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register
