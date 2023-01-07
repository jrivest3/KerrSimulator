(function () {
    //for = target thing
    //icon-position - relative to target getAttribute()
    //data-position: - 9 positions
    const collection = document.getElementsByTagName('tooltip');
    for (var i = 0; i <= collection.length; i++) {
        if (i == collection.length) continue;
        var tooltip = collection[i];
        var a = document.createElement('label');
        var b = document.createElement('input');
        b.className = 'tooltipCheckbox';
        a.style.setProperty('position', 'inherit');
        a.style.setProperty('display', (tooltip.style.display)?'inherit':'inline-block')
        var c = document.createElement('span');
        c.className = 'toolTipIcon';
        c.innerHTML = ' i ';
        c.style.setProperty('position', 'inherit');
        b.type = 'checkbox';
        b.style.setProperty('position', 'inherit');
        b.style.setProperty('left','10px');
        var createTip = (ev) => {
            var coll = document.getElementsByClassName('tooltipBox');
            for (var j = 0; j < coll.length; j++) coll[j].style.display = 'none';
            var coll2 = document.getElementsByClassName('tooltipCheckbox');
            for (j = 0; j < coll2.length; j++)
                if (coll2[j] != ev.currentTarget) coll2[j].checked = false;
            if (ev.currentTarget.checked) {
                // Move Tooltip Box to correct location
                var tooltipElem = ev.target.parentElement.parentElement;
                var tooltipIcon = tooltipElem.querySelector('.toolTipIcon');
                var tooltipBox = tooltipElem.querySelector('.tooltipBox');
                tooltipBox.style.setProperty('display','inline-block');
                tooltipBox.style.setProperty('left','0px')
                tooltipBox.style.setProperty('top','0px');
                tooltipBox.style.setProperty('position','absolute');
                var padding = 6;
                var lblProps = tooltipIcon.parentElement;
                var linkProps = tooltipIcon.getBoundingClientRect();
                linkProps = { top: linkProps.top - tooltipBox.offsetParent.offsetTop, left: linkProps.left - tooltipBox.offsetParent.offsetLeft, width: linkProps.width, height: linkProps.height }
                var tooltipProps = tooltipBox.getBoundingClientRect();
                var iconProps = { top: (linkProps.top + (linkProps.height / 2.0) + window.scrollY), left: (linkProps.left + (linkProps.width / 2.0) + window.scrollX), height: linkProps.height / 2.0, width: linkProps.width / 2.0 };
                var topPos = iconProps.top - (tooltipProps.height / 2.0);
                var leftPos = iconProps.left - (tooltipProps.width / 2.0);
                var positioning = tooltipElem.dataset.position;
                if(positioning == undefined) positioning = '';
                if (positioning == 'middle' || positioning == 'center') { }
                else if (positioning.startsWith('top') || positioning.startsWith('up')) {
                    topPos = iconProps.top - tooltipProps.height - padding - iconProps.height;
                    if (positioning.includes('right')) leftPos = iconProps.left - padding - iconProps.width;
                    else if (positioning.includes('left')) leftPos = iconProps.left - tooltipProps.width + padding + iconProps.width;
                }
                else if (positioning.startsWith('bottom') || positioning.startsWith('down')) {
                    topPos = iconProps.top + padding + iconProps.height;
                    if (positioning.includes('right')) leftPos = iconProps.left - padding - iconProps.width;
                    else if (positioning.includes('left')) leftPos = iconProps.left - tooltipProps.width + padding + iconProps.width;
                }
                else if (positioning.startsWith('left')) {
                    leftPos = iconProps.left - tooltipProps.width - padding - iconProps.width;
                    if (positioning.includes('down')) topPos = iconProps.top - padding - iconProps.height;
                    else if (positioning.includes('up')) topPos = iconProps.top - tooltipProps.height + padding + iconProps.height;
                }
                else {
                    leftPos = iconProps.left + padding + iconProps.width;
                    if (positioning.includes('down'))
                        topPos = iconProps.top - padding - iconProps.height;
                    else if (positioning.includes('up'))
                        topPos = iconProps.top - tooltipProps.height + padding + iconProps.height;
                }
                tooltipBox.style.setProperty('top', topPos + 'px');
                tooltipBox.style.setProperty('left', Math.max(0,leftPos) + 'px');

                // Move Arrow to correct location
                tooltipElem.style.setProperty('--tt-arrow-top', '10px solid transparent');
                tooltipElem.style.setProperty('--tt-arrow-left', '10px solid transparent');
                tooltipElem.style.setProperty('--tt-arrow-right', '10px solid transparent');
                tooltipElem.style.setProperty('--tt-arrow-bottom', '10px solid transparent');

                tooltipElem.style.setProperty('--tt-arrow-head-top', '6px solid transparent');
                tooltipElem.style.setProperty('--tt-arrow-head-left', '6px solid transparent');
                tooltipElem.style.setProperty('--tt-arrow-head-right', '6px solid transparent');
                tooltipElem.style.setProperty('--tt-arrow-head-bottom', '6px solid transparent');

                var arrLeft = (tooltipProps.width / 2.0) - 11;
                var arrTop = (tooltipProps.height / 2.0) - 11.5;
                var headDelta = { x: 0, y: 0 };
                if (positioning == 'middle' || positioning == 'center') { }
                else if (positioning.startsWith('top') || positioning.startsWith('up')) {
                    tooltipElem.style.setProperty('--tt-arrow-top', '10px solid #f0f7ff');
                    tooltipElem.style.setProperty('--tt-arrow-head-top', '6px solid #3d344d');
                    arrTop = tooltipProps.height - 5.5;
                    headDelta.y += 1;
                    if (positioning.includes('right')) arrLeft = 10 - 5.25;
                    else if (positioning.includes('left')) arrLeft = tooltipProps.width - linkProps.width - 7;
                }
                else if (positioning.startsWith('bottom') || positioning.startsWith('down')) {
                    tooltipElem.style.setProperty('--tt-arrow-bottom', '10px solid #f0f7ff');
                    tooltipElem.style.setProperty('--tt-arrow-head-bottom', '6px solid #3d344d');
                    arrTop = -15.25;
                    headDelta.y -= 1;
                    if (positioning.includes('right')) arrLeft = 10 - 5.25;
                    else if (positioning.includes('left')) arrLeft = tooltipProps.width - linkProps.width - 7;
                }
                else if (positioning.startsWith('left')) {
                    tooltipElem.style.setProperty('--tt-arrow-left', '10px solid #f0f7ff');
                    tooltipElem.style.setProperty('--tt-arrow-head-left', '6px solid #3d344d');
                    arrLeft = tooltipProps.width - 4;
                    headDelta.x += 1;
                    if (positioning.includes('down')) arrTop = 10 - 5.25;
                    else if (positioning.includes('up')) arrTop = tooltipProps.height - linkProps.height - 5.5;
                }
                else {
                    tooltipElem.style.setProperty('--tt-arrow-right', '10px solid #f0f7ff');
                    tooltipElem.style.setProperty('--tt-arrow-head-right', '6px solid #3d344d');
                    arrLeft = -10 - 6;
                    headDelta.x -= 1;
                    if (positioning.includes('down')) arrTop = 10 - 5.25;
                    else if (positioning.includes('up')) arrTop = tooltipProps.height - linkProps.height - 5.5;
                }
                tooltipElem.style.setProperty('--tt-arrow-pos-top', arrTop + 'px');
                tooltipElem.style.setProperty('--tt-arrow-head-pos-top', arrTop + 4 + headDelta.y + 'px');
                tooltipElem.style.setProperty('--tt-arrow-pos-left', arrLeft + 'px');
                tooltipElem.style.setProperty('--tt-arrow-head-pos-left', arrLeft + 4 + headDelta.x + 'px');
            }
        }
        if (tooltip.dataset.content == undefined)
            tooltip.innerHTML = '<div class=\'tooltipBox\' style=\'display:none\'>' + collection[i].innerHTML + '</div>';
        else {
            var tt_box = document.getElementById(tooltip.dataset.content);
            tt_box.className = 'tooltipBox';
            tt_box.style.setProperty('display', 'none');
            tt_box.addEventListener('click',()=>b.dispatchEvent(new Event('change')));
            tooltip.append(tt_box);
        }
        b.addEventListener('change', createTip);
        a.prepend(c);
        a.prepend(b);
        tooltip.prepend(a);
    }
})()