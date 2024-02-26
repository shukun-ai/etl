import { Injectable } from '@nestjs/common';
import { MongoClient } from 'mongodb';
import { AppSchema } from './app.schema';

const client = new MongoClient('mongodb://127.0.0.1:27017');

@Injectable()
export class AppService {
  async getData(props: {
    dbName: string,
    collectionName: string,
  }, queries: AppSchema): Promise<unknown[]> {
    const db = client.db(props.dbName);
    const collection = db.collection(props.collectionName);
    console.log(queries.minUpdatedAt.toISOString())
    console.log(queries);
    const rows = await collection.find({
      updatedAt: {
        $gte: queries.minUpdatedAt,
        $lte: queries.maxUpdatedAt,
      },
    }, {
      limit: queries.limit,
      skip: queries.offset,
    }).toArray();

    return rows.map(row => {
      const { _id, __v, ...props } = row;

      return {
        ...props,
        id: _id,
      }
    });
  }
}
