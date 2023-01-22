/*!
**  Ducky -- Duck-Typed Value Handling for JavaScript
**  Copyright (c) 2010-2023 Dr. Ralf S. Engelschall <rse@engelschall.com>
**
**  Permission is hereby granted, free of charge, to any person obtaining
**  a copy of this software and associated documentation files (the
**  "Software"), to deal in the Software without restriction, including
**  without limitation the rights to use, copy, modify, merge, publish,
**  distribute, sublicense, and/or sell copies of the Software, and to
**  permit persons to whom the Software is furnished to do so, subject to
**  the following conditions:
**
**  The above copyright notice and this permission notice shall be included
**  in all copies or substantial portions of the Software.
**
**  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
**  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
**  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
**  IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
**  CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
**  TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
**  SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

declare module Ducky {
    interface Ducky {
        version: {
            major: number
            minor: number
            micro: number
            date:  number
        }
        validate: {
            (obj: any, spec: string, errors?: string[]): boolean
            compile(spec: string): any
            execute(obj: any, ast: any, errors?: string[]): boolean
        }
        select: {
            (obj: any, spec: string, value?: any): any
            compile(spec: string): string[]
            execute(obj: any, path: string[]): any
        }
        params(
            name: string,
            args: any[],
            spec: {
                [key: string]: {
                    pos?: number
                    req?: boolean
                    def?: any
                    valid?: any
                }
            }
        ): any
    }
    const ducky: Ducky
}

export = Ducky.ducky

