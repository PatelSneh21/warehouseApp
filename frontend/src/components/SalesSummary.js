import React, {useState, useEffect} from 'react'


const Item = (props) => (
    <tr>
      <td>{props.item.item_name}</td>
      <td>{props.item.num_cartons}</td>
      <td>${props.item.revenue}</td>
    </tr>
  );


function SalesSummary() {
    const [salesItems, setSalesItems] = useState({
        items: [{item_name:"", num_cartons:"", item_revenue:""}]
    });

    useEffect(() => {
        fetch('http://ec2-54-83-68-204.compute-1.amazonaws.com:5000/api/salesWidget')
        .then(response => response.json())  
        .then(data => {
            setSalesItems({items: data.items});
        }).catch(error => console.log(error));
    }, []);

    // This method will map out the recent sales onto the table
    function itemList(collection) {
        return collection.items.map((currentitem) => {
            return (
            <Item
            key={currentitem["transaction_id"]}
            item={currentitem}
            />
            );
        });
    }

    return (
        <div className="home-card widgetcard">
            <h2>Recent Sales</h2>
            <table className="table table-striped" >
            <thead>
                <tr>
                <th className="itemCol-recent">Item</th>
                <th className="itemCol-recent">Cartons</th>
                <th className="dateCol-recent">Revenue</th>
                </tr>
            </thead>
            <tbody>{itemList(salesItems)}</tbody>
            </table>
        </div>
    )
}


export default SalesSummary