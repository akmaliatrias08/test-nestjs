import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { EntityNotFoundError, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import puppeteer from 'puppeteer';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const result = await this.usersRepository.insert(createUserDto);

    return this.usersRepository.findOneOrFail({
      where: {
        id: result.identifiers[0].id,
      },
    });
  }

  findAll(page: number = 1, limit: number = 10) {
    return this.usersRepository.findAndCount({
      skip: --page * limit, 
      take: limit
    });
  }

  async findOne(id: string) {
    try {
      return await this.usersRepository.findOneOrFail({
        where: {
          id,
        },
      });
    } catch (e) {
      if (e instanceof EntityNotFoundError) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            error: 'data not found',
          },
          HttpStatus.NOT_FOUND,
        );
      } else {
        throw e;
      }
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      await this.usersRepository.findOneOrFail({
        where: {
          id,
        },
      });
    } catch (e) {
      if (e instanceof EntityNotFoundError) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            error: 'Data not found',
          },
          HttpStatus.NOT_FOUND,
        );
      } else {
        throw e;
      }
    }

    await this.usersRepository.update(id, updateUserDto);

    return this.usersRepository.findOneOrFail({
      where: {
        id,
      },
    });
  }

  async remove(id: string) {
    try {
      await this.usersRepository.findOneOrFail({
        where: {
          id,
        },
      });
    } catch (e) {
      if (e instanceof EntityNotFoundError) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            error: 'Data not found',
          },
          HttpStatus.NOT_FOUND,
        );
      } else {
        throw e;
      }
    }

    await this.usersRepository.delete(id);
  }

  async generatePdfFromHtml(date: string, options = {}): Promise<Buffer>{
    const browser = await puppeteer.launch({
      args: ['--allow-file-access-from-files'], //izin akses file lokal
      headless: true,
      timeout: 60000
    })

    const formatDateToIDN = (dateString) => {
      return new Date(dateString).toLocaleString('id-ID')
    }

    const getMonth = (dateString) => {
      return new Date(dateString).toLocaleString('id-ID', {month: 'long'})
    }

    const page = await browser.newPage();
  page.setDefaultNavigationTimeout(60000);
  const [user] = await this.findAll();
  const htmlTemplate = `
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
          </head>
          <style>
            .header {
              padding: 1rem 2rem;
              display: flex;
              justify-content: space-between;
            }
            .text-under-title {
              margin-top: -1rem;
            }
            .logo {
              margin-top: 1rem;
            }
            .divider {
              width: 92%;
              border-color: black;
            }
            .info {
              padding: 1rem 2rem;
              display: flex;
            }
            .box-date,
            .box-invoice {
              width: 50%;
            }
            .main-table {
              padding: 2rem;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              border: 1px solid black;
              
            }
            th {
              border: 1px solid black;
              padding: 1rem 0;
            }
            td.normal {
              text-align: left;
              padding: 1rem;
              border: 1px solid black;
              
            }
        
            td.right {
              text-align: right;
              padding: 1rem;
              border: 1px solid black;
              
            }
            .total {
              border: 1px solid black;
              border-collapse: collapse;
            }
          </style>
          <body>
            <div class="header">
              <div>
                <h1>Invoice Pemakaian Alat</h1>
                <p class="text-under-title">PT Antasena Coretech Indonesia</p>
              </div>
              <div>
                <img src="https://i.ibb.co/F5fT3XH/logo.png" width="150px" class="logo" />
              </div>
            </div>
            <hr class="divider" />
            <div class="info">
              <div class="box-date">
                <h4>Bulan</h4>
                <p>${getMonth(date + '-01')} ${date.slice(0,4)}</p>
              </div>
              <div class="box-invoice">
                <h4>INVOICE NO</h4>
                <p>GR6789</p>
              </div>
            </div>
            <div class="main-table">
            <div style="font-weight: 600; margin-bottom: 20px">Data Pemakaian Alat :</div>
            <ol>
            ${user
              .map(
                (item, i) => `
                  <li>
                  ${i > 0 ? `<hr />` : ''}
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 20px">
                     <div style=" margin-bottom: 10px">
                      <p style="font-weight: 600">Username : </p>
                      <p>${item?.username}</p>
                    </div>
                    <div style="margin-bottom: 10px;">
                      <p style="font-weight: 600">Nama : </p>
                      <p>${item?.firstName} ${item?.lastName}</p>
                    </div>
                    <div style="margin-bottom: 10px;">
                      <p style="font-weight: 600">Tanggal Pengerjaan : </p>
                      <p>${formatDateToIDN(item?.updatedAt)}</p>
                    </div>
                  </div>
                 
                  <div style="margin-bottom: 10px; font-weight: 600">Pemakaian Alat :</div>
                </li>`,
              )
              .join('')}
            </ol>
            </div>
          </body>
        </html>

    `;

  // Set content to the provided HTML
  await page.setContent(htmlTemplate);

  // Generate PDF
  const pdfBuffer = await page.pdf(options);

  // Close the browser
  await browser.close();

  return pdfBuffer;
}
}
