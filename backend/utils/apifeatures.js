class ApiFeatures {
  constructor(query, querystr) {
    this.query = query;
    this.querystr = querystr;
  }

  search() {
    const keyword = this.querystr.keyword
      ? {
          name: {
            $regex: this.querystr.keyword,
            $options: "i", // case insensitive
          },
        }
      : {};
       
    this.query = this.query.find({ ...keyword });

    return this;
  }
  filter() {
    const queryCopy = { ...this.querystr };
    const removeFields = ["keyword", "page", "limit"];
    removeFields.forEach((key) => {
      delete queryCopy[key];
    });

    //filter for price and  ratings
    let queryStr = JSON.stringify(queryCopy);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);
    queryStr = JSON.parse(queryStr);
    this.query = this.query.find(queryStr);
    return this;
  }
  pagination(){
   
    const page=Number(this.querystr.page)||1;
    const perPage=Number(this.querystr.per_page)||5;
    const skipValue= perPage*(page-1);
    this.query=this.query.limit(perPage).skip(skipValue);
    return this;
  }
}
module.exports = ApiFeatures;
