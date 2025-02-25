// Copyright 2022 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.


/**
 * Declare a fake property so that it exists in a class. This is to avoid
 * jscompiler errors about that the property that does not exit; the property is
 * accessed on objects of unknown type.
 * @type {!Array<!Object>}
 */
ThrowableUtils.prototype.suppressed;

/**
 * @param {*} error
 * @param {!Throwable} throwable
 * @public
 */
ThrowableUtils.setJavaThrowable = function(error, throwable) {
  if (error instanceof Object) {
    try {
      // This may throw exception (e.g. frozen object) in strict mode.
      error.__java$exception = throwable;
      // TODO(b/142882366): Pass get fn as JsFunction from Java instead.
      Object.defineProperties(error, {
        cause: {
          get: () => throwable.getCause() && throwable.getCause().backingJsObject
        },
        suppressed: {
          get: () => throwable.getSuppressed().map(t => t.backingJsObject)
        }
      });
    } catch (ignored) {}
  }
};
