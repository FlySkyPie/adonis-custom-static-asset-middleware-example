/**
 * The MIT License (MIT)
 * 
 * Copyright 2021 Harminder Virk
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:

 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.

 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Config from '@ioc:Adonis/Core/Config'
import Application from '@ioc:Adonis/Core/Application'
import staticServer from 'serve-static'
import { Stats } from 'fs'

export default class StaticAssetMiddleware {
  private config = Config.get('static', {});
  private publicPath = Application.publicPath();
  private serve = staticServer(
    this.publicPath,
    Object.assign({}, this.config, {
      setHeaders: (res: any, path: string, stats: Stats) => {
        const headers = res.parent.getHeaders()
        Object.keys(headers).forEach((key) => {
          res.setHeader(key, headers[key])
        })

        /**
         * Set user defined custom headers
         */
        if (typeof this.config.headers === 'function') {
          const customHeaders = this.config.headers(path, stats)
          Object.keys(customHeaders).forEach((key) => {
            res.setHeader(key, customHeaders[key])
          })
        }
      },
    })
  )

  public async handle(context: HttpContextContract, next: () => Promise<void>) {
    try {
      await this.servePromise(context);;
    } catch (error) {
      await next();
    }
  }

  private async servePromise({ request, response }: HttpContextContract) {
    return new Promise<void>((resolve, reject) => {
      //This been call when the file is served.
      function next() {
        response.response.removeListener('finish', next)
        resolve()
      }

      response.response['parent'] = response

      response.response.addListener('finish', next)
      this.serve(request.request, response.response, () => {
        reject('The file not found.');
      })
    })
  }
}
