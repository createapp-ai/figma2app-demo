/* eslint-disable max-lines */
import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

// https://chat.openai.com/share/422a151c-76a3-4d1a-8aae-9b0588e58134
const errorMappings: Record<string, { status: number; message: string }> = {
  P2000: {
    status: HttpStatus.BAD_REQUEST,
    message:
      "The provided value for the column is too long for the column's type",
  },
  P2001: {
    status: HttpStatus.NOT_FOUND,
    message: 'The record searched for in the where condition does not exist',
  },
  P2002: {
    status: HttpStatus.CONFLICT,
    message: 'Unique constraint failed on the constraint',
  },
  P2003: {
    status: HttpStatus.BAD_REQUEST,
    message: 'Foreign key constraint failed on the field',
  },
  P2004: {
    status: HttpStatus.BAD_REQUEST,
    message: 'A constraint failed on the database',
  },
  P2005: {
    status: HttpStatus.BAD_REQUEST,
    message:
      "The value stored in the database for the field is invalid for the field's type",
  },
  P2006: {
    status: HttpStatus.BAD_REQUEST,
    message: 'The provided value for the field is not valid',
  },
  P2007: { status: HttpStatus.BAD_REQUEST, message: 'Data validation error' },
  P2008: {
    status: HttpStatus.BAD_REQUEST,
    message: 'Failed to parse the query',
  },
  P2009: {
    status: HttpStatus.BAD_REQUEST,
    message: 'Failed to validate the query',
  },
  P2010: { status: HttpStatus.BAD_REQUEST, message: 'Raw query failed' },
  P2011: {
    status: HttpStatus.BAD_REQUEST,
    message: 'Null constraint violation on the constraint',
  },
  P2012: {
    status: HttpStatus.BAD_REQUEST,
    message: 'Missing a required value',
  },
  P2013: {
    status: HttpStatus.BAD_REQUEST,
    message: 'Missing the required argument for field on object',
  },
  P2014: {
    status: HttpStatus.BAD_REQUEST,
    message: 'The change would violate the required relation between models',
  },
  P2015: {
    status: HttpStatus.NOT_FOUND,
    message: 'A related record could not be found',
  },
  P2016: {
    status: HttpStatus.BAD_REQUEST,
    message: 'Query interpretation error',
  },
  P2017: {
    status: HttpStatus.BAD_REQUEST,
    message: 'The records for relation are not connected',
  },
  P2018: {
    status: HttpStatus.NOT_FOUND,
    message: 'The required connected records were not found',
  },
  P2019: { status: HttpStatus.BAD_REQUEST, message: 'Input error' },
  P2020: {
    status: HttpStatus.BAD_REQUEST,
    message: 'Value out of range for the type',
  },
  P2021: {
    status: HttpStatus.BAD_REQUEST,
    message: 'The table does not exist in the current database',
  },
  P2022: {
    status: HttpStatus.BAD_REQUEST,
    message: 'The column does not exist in the current database',
  },
  P2023: {
    status: HttpStatus.BAD_REQUEST,
    message: 'Inconsistent column data',
  },
  P2024: {
    status: HttpStatus.REQUEST_TIMEOUT,
    message: 'Timed out fetching a new connection from the connection pool',
  },
  P2025: {
    status: HttpStatus.BAD_REQUEST,
    message:
      'An operation failed because it depends on one or more records that were required but not found',
  },
  P2026: {
    status: HttpStatus.BAD_REQUEST,
    message:
      "The current database provider doesn't support a feature that the query used",
  },
  P2027: {
    status: HttpStatus.BAD_REQUEST,
    message: 'Multiple errors occurred on the database during query execution',
  },
  P2028: { status: HttpStatus.BAD_REQUEST, message: 'Transaction API error' },
  P2030: {
    status: HttpStatus.BAD_REQUEST,
    message: 'Cannot find a fulltext index to use for the search',
  },
  P2031: {
    status: HttpStatus.BAD_REQUEST,
    message:
      'Prisma needs to perform transactions, which requires your MongoDB server to be run as a replica set',
  },
  P2033: {
    status: HttpStatus.BAD_REQUEST,
    message:
      'A number used in the query does not fit into a 64 bit signed integer',
  },
  P2034: {
    status: HttpStatus.CONFLICT,
    message: 'Transaction failed due to a write conflict or a deadlock',
  },
};

@Catch(Prisma.PrismaClientKnownRequestError, Prisma.PrismaClientValidationError)
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
  catch(
    exception:
      | Prisma.PrismaClientValidationError
      | Prisma.PrismaClientKnownRequestError,
    host: ArgumentsHost,
  ) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    console.error('Prisma Error', exception.message);
    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      const errorMapping = errorMappings[exception.code];
      if (!errorMapping) {
        return super.catch(exception, host);
      }
      response.status(errorMapping.status).json({
        error: errorMapping?.message,
      });
    } else {
      response.status(HttpStatus.BAD_REQUEST).json({
        error: 'Bad Request',
      });
    }
  }
}
