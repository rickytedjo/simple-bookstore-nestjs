import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as pactum from 'pactum';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/prisma/prisma.service';
import { AuthDto, RegDto } from './../src/modules/auth/dto';
import { createUserDto, editUserDto } from './../src/modules/user/dto';
import { createBookDto, editBookDto } from 'src/modules/book/dto';
import { createTransactionDto } from 'src/modules/transaction/dto';

describe('App E2E', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();
    await app.listen(3030);

    prisma = app.get(PrismaService);
    await prisma.cleanDb(); 
    pactum.request.setBaseUrl('http://127.0.0.1:3030');
  });

  afterAll(async () => {
    await app.close();
  });

  /**
   * Authentication Tests
   */
  describe('Auth', () => {
    const authDto: AuthDto = {
      email: 'test@gmail.com',
      password: '123',
    };
    const regDto: RegDto = {
      email: 'test@gmail.com',
      password: '123',
      username: 'testguy',
    };

    describe('Signup', () => {
      it('Should signup successfully', () => {
        return pactum.spec().post('/auth/signup').withBody(regDto).expectStatus(201);
      });

      it('Should fail if email is missing', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({ password: regDto.password, username: regDto.username })
          .expectStatus(400);
      });

      it('Should fail if password is missing', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({ email: regDto.email, username: regDto.username })
          .expectStatus(400);
      });

      it('Should fail if username is missing', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({ email: regDto.email, password: regDto.password })
          .expectStatus(400);
      });

      it('Should fail if body is empty', () => {
        return pactum.spec().post('/auth/signup').expectStatus(400);
      });
    });

    describe('Signin', () => {
      it('Should sign in successfully and store access token', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(authDto)
          .expectStatus(200)
          .stores('userAt', 'access_token');
      });

      it('Should fail if email is missing', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({ password: authDto.password })
          .expectStatus(400);
      });

      it('Should fail if password is missing', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({ email: authDto.email })
          .expectStatus(400);
      });

      it('Should fail if body is empty', () => {
        return pactum.spec().post('/auth/signin').expectStatus(400);
      });
    });
  });

  describe('Users', () => {
    const createUserDto: createUserDto = {
      email: 'test2@gmail.com',
      password: '1234',
      username: 'testguy2',
    };
    const editUserDto: editUserDto = {
      email: 'test3@gmail.com',
      password: '1235',
      username: 'testguy1',
    }

    describe('Create User', () => {
      it('Should fail without token', () => {
        return pactum.spec().post('/user').withBody(createUserDto).expectStatus(401);
      });

      it('Should create user successfully with valid token', () => {
        return pactum
          .spec()
          .post('/user')
          .withBearerToken('$S{userAt}')
          .withBody(createUserDto)
          .expectStatus(201)
          .stores('userId', 'id');
      });
    });

    describe('Get Users', () => {
      it('Should fail without token', () => {
        return pactum.spec().get('/user').expectStatus(401);
      });

      it('Should retrieve users successfully', () => {
        return pactum.spec().get('/user').withBearerToken('$S{userAt}').expectStatus(200);
      });
    });

    describe('Get User by ID', () => {
      it('Should fail without token', () => {
        return pactum
          .spec()
          .get('/user/{id}')
          .withPathParams('id', '$S{userId}')
          .expectStatus(401);
      });

      it('Should retrieve user by ID successfully', () => {
        return pactum
          .spec()
          .get('/user/{id}')
          .withPathParams('id', '$S{userId}')
          .withBearerToken('$S{userAt}')
          .expectStatus(200);
      });
    });

    describe('Edit User by ID', () => {
      it('Should fail without token', () => {
        return pactum
          .spec()
          .patch('/user/{id}')
          .withPathParams('id', '$S{userId}')
          .withBody(editUserDto)
          .expectStatus(401);
      });

      it('Should modify user by ID successfully', () => {
        return pactum
          .spec()
          .patch('/user/{id}')
          .withPathParams('id', '$S{userId}')
          .withBearerToken('$S{userAt}')
          .withBody(editUserDto)
          .expectStatus(200);
      });
    });
  });
  describe('Book', () => {
    const createBookDto: createBookDto = {
      title: 'The Prince',
      price: 20000,
      desc: 'by Machiavelli'
    };

    const editBookDto : editBookDto = {
      title : 'The Illiad',
      price : 15000,
      desc : 'Homer Simpson'
    }

    describe('Create Book', () => {
      it('Should fail without token', () => {
        return pactum.spec().post('/book').withBody(createBookDto).expectStatus(401);
      });

      it('Should create book successfully with valid token', () => {
        return pactum
          .spec()
          .post('/book')
          .withBearerToken('$S{userAt}')
          .withBody(createBookDto)
          .expectStatus(201)
          .stores('bookId', 'id');
      });
    });

    describe('Get Books', () => {
      it('Should fail without token', () => {
        return pactum.spec().get('/book').expectStatus(401);
      });

      it('Should retrieve books successfully', () => {
        return pactum.spec().get('/book').withBearerToken('$S{userAt}').expectStatus(200);
      });
    });

    describe('Get Book by ID', () => {
      it('Should fail without token', () => {
        return pactum
          .spec()
          .get('/book/{id}')
          .withPathParams('id', '$S{bookId}')
          .expectStatus(401);
      });

      it('Should retrieve book by ID successfully', () => {
        return pactum
          .spec()
          .get('/book/{id}')
          .withPathParams('id', '$S{bookId}')
          .withBearerToken('$S{userAt}')
          .expectStatus(200);
      });
    });

    describe('Edit Book by ID', () => {
      it('Should fail without token', () => {
        return pactum
          .spec()
          .patch('/book/{id}')
          .withPathParams('id', '$S{bookId}')
          .withBody(editBookDto)
          .expectStatus(401);
      });

      it('Should modify book by ID successfully', () => {
        return pactum
          .spec()
          .patch('/book/{id}')
          .withPathParams('id', '$S{bookId}')
          .withBearerToken('$S{userAt}')
          .withBody(editBookDto)
          .expectStatus(200);
      });
    });
  });
});
