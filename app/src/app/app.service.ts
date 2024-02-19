import { Injectable } from '@nestjs/common';
import { MongoClient, WithId } from 'mongodb';

const client = new MongoClient('mongodb://127.0.0.1:27017');

@Injectable()
export class AppService {
  async getData(props: {
    dbName: string,
    collectionName: string,
  }): Promise<unknown[]> {
    const db = client.db(props.dbName);
    const collection = db.collection(props.collectionName);
    const rows = await collection.find().limit(10).toArray();
    return rows;
  }
}
