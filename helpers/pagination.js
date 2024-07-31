
module.exports = ( objectPagination,query,countRecords)=>{
    if(query.page){
        objectPagination.currentPage = parseInt(query.page); 
    }
    if(query.limit){
        objectPagination.litmitItems = parseInt(query.limit);
    }

    objectPagination.skip = (objectPagination.currentPage - 1)*objectPagination.litmitItems;

    const totalPages = Math.ceil(countRecords/objectPagination.litmitItems);

    objectPagination.totalPage = totalPages 

    return objectPagination;
}