import React, {useState, useEffect} from 'react'


const Item = (props) => (
    <tr>
      <td>{props.item.item_name}</td>
      <td>{props.item.item_revenue}</td>
    </tr>
  );


function SalesSummary() {
    const [salesItems, setSalesItems] = useState({
        items: []
    });

    //TODO CHANGE TO ACTUAL ENDPOINT
    // useEffect(() => {
    //     fetch('http://example.com/movies.json')
    //     .then((response) =>{
    //         setSalesItems({items: response.data});
    //     }).catch(error => console.log(error));
    // }, []);

    // This method will map out the recent sales onto the table
    function itemList(collection) {
        return collection.items.map((currentitem) => {
            return (
            <Item
            key={currentitem._id}
            item={currentitem}
            />
            );
        });
    }

    return (
        <div className="home-card">
            <h3>Recent Sales</h3>
            <table className="table table-striped" >
            <thead>
                <tr>
                <th className="itemCol-recent">Item</th>
                <th className="dateCol-recent">Revenue</th>
                </tr>
            </thead>
            <tbody>{itemList(salesItems)}</tbody>
            </table>
        </div>
    )
}


export default SalesSummary