import React, {useState, useEffect} from 'react'

const Item = (props) => (
  <tr>
    <td>{props.item.item_name}</td>
    <td>{props.item.num_cartons}</td>
  </tr>
);

function PurchasesSummary() {
  const [items, setItems] = useState({
    items: [{item_name:"", num_cartons:"",}]
});

  useEffect(() => {
    fetch('http://http://ec2-54-83-68-204.compute-1.amazonaws.com:5000/api/purchaseWidget')
    .then(response => response.json())  
    .then(data => {
        setItems({items: data.items});
    }).catch(error => console.log(error));
  }, []);


    // This method will map out the recent sales onto the table
    function itemList(collection) {
      return collection.items.map((currentitem) => {
          return (
          <Item
          key={currentitem["deposit_id"]}
          item={currentitem}
          />
          );
      });
  }

  return (
    <div className="home-card widgetcard">
    <h2>Recent Purchases</h2>
    <table className="table table-striped widgettable" >
    <thead>
        <tr>
        <th className="itemCol-recent">Item</th>
        <th className="itemCol-recent">Cartons</th>
        </tr>
    </thead>
    <tbody>{itemList(items)}</tbody>
    </table>
</div>
  )
}

export default PurchasesSummary
