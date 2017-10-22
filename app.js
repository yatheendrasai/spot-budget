//module-1 
var BudgetController=(function(){
    
    var Inclist=function(ID,desc,value){
        this.ID=ID;
        this.desc=desc;
        this.value=value;
    }
    
    var Explist=function(ID,desc,value,percentage){
        this.ID=ID;
        this.desc=desc;
        this.value=value;
        this.percentage=percentage;
    }
    Explist.prototype.calPer=function(totalincome){
        this.percentage=Math.round((this.value/totalincome)*100);
    }
    Explist.prototype.getPer=function(){
        return this.percentage;
    }
    var calculateBudgetOwn=function(type){
        var sum=0;
            data.items[type].forEach(function(cur){
                sum+=cur.value;
            });
            data.totals[type]=sum;
            
    }
    var data ={
        items: {
            exp:[],
            inc:[]
        },
        totals:{
            exp:0,
            inc:0
        },
        budget:0,
        percentage:0
    }
       
    return {
        createItem: function(e){
            if(e.type==='inc'){
                if(data.items.inc.length>0){
                var newID=data.items.inc[data.items.inc.length-1].ID+1;
                }
                else{
                    newID=0;
                }
                var newItem=new Inclist(newID,e.desc,e.value);
                data.items.inc.push(newItem);
                return newItem;
            }
            else{
                if(data.items.exp.length>0){
                var newID=data.items.exp[data.items.exp.length-1].ID+1;
                }
                else{
                    newID=0;
                }
                var newItem=new Explist(newID,e.desc,e.value);
                data.items.exp.push(newItem);
                return newItem    
            }
        },
        printdata: function(){
            console.log(data);
        },
        calculateBudget: function(){
            calculateBudgetOwn('exp');
            calculateBudgetOwn('inc');
            data.budget=data.totals.inc-data.totals.exp;
            if(data.totals.inc>0){
                data.percentage=Math.round((data.totals.exp/data.totals.inc)*100);
            }
            else{
                data.percentage=-1;
            }
        },
        getCalculatedBudget: function(){
            return {
                budget:data.budget,
                percentage: data.percentage,
                cal_inc:data.totals.inc,
                cal_exp:data.totals.exp
            }
        },
        deleteItem: function(type,id){
            var p=data.items[type].map(function(cur){
                return cur.ID;
            });
            var index=p.indexOf(id);
            console.log("del-->"+id);
            if(index!==-1){
                data.items[type].splice(index,1);
                
            }
        },
        calculatePercentage: function(){
            data.items.exp.forEach(function(cur){
                cur.calPer(data.totals.inc);
            });
        },
        getPercentage: function(){
            var perArr;
            perArr=data.items.exp.map(function(cur){
                return cur.getPer();
            });
            return perArr;
        }
    }
})();


//module-2
var UIController=(function(){
    var Domcmnds={
        type: ".add__type",
        desc: ".add__description",
        value:".add__value",
        btn:".add__btn",
        income:".income__list",
        expenses:".expenses__list",
        income_value:".budget__income--value",
        expenses_value:".budget__expenses--value",
        budget_value:".budget__value",
        expenses_percentage:".budget__expenses--percentage",
        cross_button:".container",
        itemper: ".item__percentage",
        monthyear:".budget__title--month"
    }
    function formatNumbers(num,type){
            var int,dec,temp,sign;
            num=Math.abs(num);
            num=num.toFixed(2);
            temp=num.split('.');
            int =temp[0];
            dec=temp[1];
            if(int.length>3){
                int=int.substr(0,int.length-3)+','+int.substr(int.length-3,3);
            }
            type==='exp'?sign='-':sign='+';
            int =sign+int+'.';
            int+=dec;
            console.log('final-->'+int);
            return int;
    }
    var forEachNode=function(fields,callback){
                for(var i=0;i<fields.length;i++){
                    callback(fields[i],i);
                }
    }
    return {
        getDomcmnds: function(){
            return Domcmnds;
        },
        getInput: function(){
            return {
                type: document.querySelector(Domcmnds.type).value,
                desc: document.querySelector(Domcmnds.desc).value,
                value: parseFloat(document.querySelector(Domcmnds.value).value)
            };
        },
        addItem: function(obj,type){
            var html,newHtml,element;
            if(type==="inc"){
                element=Domcmnds.income;
                html='<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
         
                
            }
            else{
                element=Domcmnds.expenses;
                html='<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            newHtml=html.replace('%description%',obj.desc);
            newHtml=newHtml.replace('%id%',obj.ID);
            newHtml=newHtml.replace('%value%',formatNumbers(obj.value,type));
            
            document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);
        },
        clearUI:function(){
            
            var list=document.querySelectorAll(Domcmnds.desc+','+Domcmnds.value);
            var arrlist=Array.prototype.slice.call(list);
            
            arrlist.forEach(function(cur,ind){
                cur.value="";    
            });
            
            arrlist[0].focus();
        },
        displayUI: function(newBudget){
            var type;
            if(newBudget.budget>0)
                type='inc';
            else
                type='exp';
            document.querySelector(Domcmnds.budget_value).textContent=formatNumbers(newBudget.budget,type);
            document.querySelector(Domcmnds.income_value).textContent=formatNumbers(newBudget.cal_inc,'inc');
            document.querySelector(Domcmnds.expenses_value).textContent=formatNumbers(newBudget.cal_exp,'exp');
            if(newBudget.percentage>0)
                document.querySelector(Domcmnds.expenses_percentage).textContent=newBudget.percentage+'%';
            else
                document.querySelector(Domcmnds.expenses_percentage).textContent='---';
            
        },
        deleteUIElement: function(itemID){
            
            var i=document.getElementById(itemID);
            i.parentNode.removeChild(i);
            
        },
        percentageUI: function(perArr){
            var list=document.querySelectorAll(Domcmnds.itemper);
            
            forEachNode(list,function(cur,index){
                if(perArr[index]>0)
                cur.textContent=perArr[index]+'%';
                else
                cur.textContent='--';
            });
        },
        monthYear:function(){
            var now=new Date();
            var year=now.getFullYear();
            var months=['jan','feb','mar','apr','may','june','july','aug','sept','oct','nov','dec'];
            var mnth=now.getMonth();
            document.querySelector(Domcmnds.monthyear).textContent=months[mnth]+" "+year;
        },
        changedType: function(){
            var list=document.querySelectorAll(Domcmnds.type+','+Domcmnds.desc+','+Domcmnds.value);
            forEachNode(list,function(cur){
               cur.classList.toggle('red-focus');         
            });
            document.querySelector(Domcmnds.btn).classList.toggle('red');
        }
    }
})();

//module-3
var Controller=(function(bctrl,uctrl){
    
    var Domcmnds=uctrl.getDomcmnds();
    
    var eventListenersGroup=function(){
        document.querySelector(Domcmnds.btn).addEventListener('click',ctrlAddItem);
        document.addEventListener('keypress',function(event){
                if(event.keyCode===13||event.which===13){
                    ctrlAddItem();
                } 
        });
        document.querySelector(Domcmnds.cross_button).addEventListener('click',ctrlDeleteItem);
        document.querySelector(Domcmnds.type).addEventListener('change',uctrl.changedType);
    };
    
    
    function ctrlAddItem(){
        
        //getinput from webpage and add to data model
        var obj=uctrl.getInput();
        console.log(obj.value);
        if(obj.desc!="" && !isNaN(obj.value)&&obj.value>0){
            var ec=bctrl.createItem(obj);
            console.log(ec);
            bctrl.printdata();

            //add ui element to webpage with created list entry
            uctrl.addItem(ec,obj.type);
            uctrl.clearUI();

            //create and update budget
            budgetmanager();
            
            percentagemanager();
        }
    }
    function budgetmanager(obj){
        //calculate budget
        bctrl.calculateBudget();
        //get new budget details
        var newBudget=bctrl.getCalculatedBudget();
        console.log(newBudget);
        //send it to UI
        uctrl.displayUI(newBudget);
    }
    function ctrlDeleteItem(event){
        var itemID,type,ID;
        itemID=event.target.parentNode.parentNode.parentNode.parentNode.id;
        console.log(itemID);
        if(itemID){
            var temp=itemID.split('-');
            type=temp[0];
            ID=parseInt(temp[1]);
            console.log(type+" "+ID);
            bctrl.deleteItem(type,ID);
            uctrl.deleteUIElement(itemID);
            budgetmanager();
            percentagemanager();
            
        }
    }
    function percentagemanager(){
        bctrl.calculatePercentage();
        var perArr=bctrl.getPercentage();
        console.log(perArr);
        uctrl.percentageUI(perArr);
        console.log("after");
        
    }
    return {
        init: function(){
            eventListenersGroup();
            uctrl.displayUI({
                budget:0,
                percentage: 0,
                cal_inc:0,
                cal_exp:0
            });
            uctrl.monthYear();
        }
    }
})(BudgetController,UIController);

Controller.init();

