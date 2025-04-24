export type TCloudinaryResponse = {
    public_id: string;
    asset_id: string;
    version: number;
    version_id: string;
    signature: string;
    width: number;
    height: number;
    format: string;
    resource_type: string;
    created_at: string;
    tags: string[];
    bytes: number;
    type: string;
    etag: string;
    placeholder: boolean;
    url: string;
    folder: string;
    secure_url: string;
    original_filename: string;
    overwritten: boolean;
    original_extension: string;
    api_key: string;
}

export type TFile = {
    fieldname: string
    originalname: string
    encoding: string
    mimetype: string
    destination: string
    filename: string
    path: string
    size:number
}