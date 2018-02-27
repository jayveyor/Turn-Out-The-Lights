import React from 'react';


const Game = (props) => {
    return (
      <div className="game">
        <div className="wrap">
        
                {props.buttons}
                {props.signOut}
                {props.painOverlay}
                {props.overlay}
                <div className={props.objCont}>
                {props.gameObject}</div>
                {props.location}
      
        </div>
        
      </div>
      )
}

export default Game;