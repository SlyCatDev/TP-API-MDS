// import bcrypt from 'bcrypt';
// import { User } from '../models/user';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const router = Router();


router.post('/login', authenticateJWT, async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ where: { username } });

    if (!user) {
      return res.status(400).json({ message: 'Utilisateur non trouvé' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Identifiants invalides' });
    }

    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(
      payload,
      SECRET_KEY,
      { 
        algorithm: 'HS256',
        expiresIn: '1h'
      },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;