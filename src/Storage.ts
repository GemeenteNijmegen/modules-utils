import {
  CopyObjectCommand,
  GetObjectCommand,
  GetObjectCommandInput,
  GetObjectCommandOutput,
  ListObjectsV2Command,
  ListObjectsV2Output,
  ListObjectsV2Request,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import {
  getSignedUrl,
} from '@aws-sdk/s3-request-presigner';

export interface Storage {
  store(key: string, contents: string): Promise<boolean>;
  copy(
    sourceBucket: string,
    sourceKey: string,
    sourceRegion: string,
    destinationKey: string
  ): Promise<boolean>;
  get(key: string): Promise<GetObjectCommandOutput| undefined>;
  getBatch( keys: string[]): Promise<GetObjectCommandOutput[]>;
  searchAllObjectsByShortKey(searchKey: string): Promise<string[]>;
}

export class S3Storage implements Storage {
  private bucket: string;
  private s3Client: S3Client;
  private clients: any = {
    default: new S3Client({}),
  };

  constructor(bucket: string, config?: { client?: S3Client }) {
    this.bucket = bucket;
    this.s3Client = config?.client ?? new S3Client({});
  }

  public async store(key: string, contents: string) {
    console.debug(
      `Storing ${key} with contents of size ${contents.length} to ${this.bucket}`,
    );
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: contents,
      ServerSideEncryption: 'aws:kms',
    });
    try {
      await this.s3Client.send(command);
      console.debug(`successfully stored ${key}`);
    } catch (err) {
      console.error(err);
      return false;
    }
    return true;
  }

  public async get( key: string): Promise<GetObjectCommandOutput | undefined > {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    } as GetObjectCommandInput );
    try {
      const bucketObject = await this.s3Client.send(command);
      return bucketObject;
    } catch (err) {
      console.error(`getBucketObject failed for key ${key} with error: `, err);
      return undefined;
    }
  }

  public async getBatch( keys: string[]): Promise<GetObjectCommandOutput[]> {
    const promises = keys.map((key) => this.get(key));
    const results = await Promise.allSettled(promises);
    const bucketObjects = (results.filter((result, index) => {
      if (result.status == 'rejected') {
        console.log(`object ${keys[index]} in batch failed: ${result.reason}`);
      }
      return result.status == 'fulfilled' && result.value;
    }) as PromiseFulfilledResult<GetObjectCommandOutput>[]);
    return bucketObjects.map(bucketObject => bucketObject.value);
  }

  /**
   * Copy an S3 object between buckets.
   *
   * If both buckets are in the same region, this will use the CopyObject command.
   * **NB**: This requires s3:getObjectTagging permissions on the source object.
   */
  public async copy(
    sourceBucket: string,
    sourceKey: string,
    sourceRegion: string,
    destinationKey: string,
  ) {
    const currentRegion = this.clients.default.region ?? process.env.AWS_REGION;
    if (currentRegion == sourceRegion) {
      console.debug(
        'Source and destination in same region, use more efficiënt copy command',
      );
      try {
        return await this.copyInSameRegion(sourceBucket, sourceKey, destinationKey);
      } catch (error) {
        console.warn('Efficient Copy command failed. Do you have s3:getObjectTagging permissions set for the source bucket? Falling back to old style copy.');
      }
    }

    await this.copyByGetAndPutObject(sourceBucket, sourceKey, sourceRegion, destinationKey);
    console.debug(
      `successfully copied ${sourceBucket}/${sourceKey} to ${destinationKey}`,
    );
    return true;
  }

  private async copyByGetAndPutObject(sourceBucket: string, sourceKey: string, sourceRegion: string, destinationKey: string) {
    const getObjectCommand = new GetObjectCommand({
      Bucket: sourceBucket,
      Key: sourceKey,
    });
    try {
      const object = await this.clientForRegion(sourceRegion).send(
        getObjectCommand,
      );
      const putObjectCommand = new PutObjectCommand({
        Bucket: this.bucket,
        Key: destinationKey,
        Body: object.Body,
        // Request needs to know length to accept a stream: https://github.com/aws/aws-sdk-js/issues/2961#issuecomment-1580901710
        ContentLength: object.ContentLength,
      });
      await this.clients.default.send(putObjectCommand);
    } catch (err) {
      console.error(err);
    }
  }

  private async copyInSameRegion(sourceBucket: string, sourceKey: string, destinationKey: string) {
    console.debug(
      `syncing ${sourceBucket}/${sourceKey} to ${destinationKey}`,
    );

    const command = new CopyObjectCommand({
      CopySource: encodeURI(`${sourceBucket}/${sourceKey}`),
      Bucket: this.bucket,
      Key: destinationKey,
    });

    try {
      await this.s3Client.send(command);
      console.debug(
        `successfully copied ${sourceBucket}/${sourceKey} to ${destinationKey}`,
      );
    } catch (err) {
      console.error(`Failed to copy object: ${sourceBucket}/${sourceKey} ${err}`);
      throw err;
    }
    return true;
  }

  public async searchAllObjectsByShortKey(
    searchKey: string,
  ): Promise<string[]> {
    console.info(
      `start searching all objects with listV2Object with searchkey ${searchKey}`,
    );

    const allKeys: string[] = [];
    const command = new ListObjectsV2Command({
      Bucket: this.bucket,
      Prefix: searchKey,
    } as ListObjectsV2Request);

    let isTruncated: boolean = true;

    while (isTruncated) {
      console.log('In while isTruncated loop');
      const listObjectsV2Output: ListObjectsV2Output =
          await this.s3Client.send(command);
      //TODO: make submission.json are variable and change the function name
      listObjectsV2Output.Contents?.filter((contents) => contents.Key?.includes('submission.json') ).map((contents) => {
        contents.Key ? allKeys.push(contents?.Key) : console.log(
          '[searchAllObjectsByShortKey] Individual key not found and not added to allKeys.',
        );
      });
      isTruncated = !!listObjectsV2Output.IsTruncated;
      command.input.ContinuationToken =
          listObjectsV2Output.NextContinuationToken;
    }
    console.info(
      `[searchAllObjectsByShortKey] Found ${allKeys.length} bucket objects with prefix ${searchKey}`,
    );
    return allKeys;
  }

  public getPresignedUrl(key: string, expiresIn?: number) {
    const command = new GetObjectCommand({ Bucket: this.bucket, Key: key });
    return getSignedUrl(this.clients.default, command, { expiresIn: expiresIn ?? 5 });
  }

  private clientForRegion(region: string): S3Client {
    if (!this.clients[region]) {
      this.clients[region] = new S3Client({ region: region });
    }
    return this.clients[region];
  }
}
